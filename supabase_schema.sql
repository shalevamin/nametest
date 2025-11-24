-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Enums
create type user_role as enum ('admin', 'volunteer', 'candidate');
create type inquiry_priority as enum ('low', 'medium', 'high', 'critical');
create type inquiry_status as enum ('received', 'in_treatment', 'awaiting_docs', 'closed');

-- Create Profiles Table (Publicly visible profile info)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role user_role default 'candidate',
  is_approved boolean default false,
  phone text,
  volunteer_start_date date,
  email text, -- Copied from auth.users for easier querying
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Inquiries Table
create table inquiries (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status inquiry_status default 'received' not null,
  priority inquiry_priority default 'low' not null,
  subject text not null,
  description text not null,
  submitter_name text not null,
  submitter_email text not null,
  submitter_phone text not null,
  is_archived boolean default false
);

-- Create Inquiry Assignments (Many-to-Many)
create table inquiry_assignments (
  inquiry_id uuid references inquiries(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (inquiry_id, user_id)
);

-- Create Inquiry Notes
create table inquiry_notes (
  id uuid default uuid_generate_v4() primary key,
  inquiry_id uuid references inquiries(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete set null, -- If user is deleted, keep note? Or cascade. Set null is safer for history.
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Inquiry Files (Metadata for storage)
create table inquiry_files (
  id uuid default uuid_generate_v4() primary key,
  inquiry_id uuid references inquiries(id) on delete cascade not null,
  file_path text not null,
  file_name text not null,
  uploaded_by uuid references profiles(id) on delete set null, -- Nullable for public uploads
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table inquiries enable row level security;
alter table inquiry_assignments enable row level security;
alter table inquiry_notes enable row level security;
alter table inquiry_files enable row level security;

-- RLS Policies

-- Profiles:
-- Public can't see profiles.
-- Users can see their own profile.
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- Admins can view all profiles.
create policy "Admins can view all profiles" on profiles
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update profiles (approve users).
create policy "Admins can update profiles" on profiles
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'candidate');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- Inquiries:
-- Public can insert inquiries (Submission form).
create policy "Public can insert inquiries" on inquiries
  for insert with check (true);

-- Admins and Approved Volunteers can view inquiries.
create policy "Staff can view inquiries" on inquiries
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and (role = 'admin' or (role = 'volunteer' and is_approved = true))
    )
  );

-- Admins and Approved Volunteers can update inquiries.
create policy "Staff can update inquiries" on inquiries
  for update using (
    exists (
      select 1 from profiles
      where id = auth.uid() and (role = 'admin' or (role = 'volunteer' and is_approved = true))
    )
  );

-- Inquiry Assignments:
-- Admins can manage assignments.
create policy "Admins can manage assignments" on inquiry_assignments
  for all using (
    exists (
      select 1 from profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Volunteers can view their assignments.
create policy "Volunteers can view assignments" on inquiry_assignments
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and (role = 'volunteer' and is_approved = true)
    )
  );

-- Inquiry Notes:
-- Staff can view notes.
create policy "Staff can view notes" on inquiry_notes
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and (role = 'admin' or (role = 'volunteer' and is_approved = true))
    )
  );

-- Staff can insert notes.
create policy "Staff can insert notes" on inquiry_notes
  for insert with check (
    exists (
      select 1 from profiles
      where id = auth.uid() and (role = 'admin' or (role = 'volunteer' and is_approved = true))
    )
  );

-- Inquiry Files:
-- Public can insert files (attached to inquiry).
create policy "Public can insert files" on inquiry_files
  for insert with check (true);

-- Staff can view files.
create policy "Staff can view files" on inquiry_files
  for select using (
    exists (
      select 1 from profiles
      where id = auth.uid() and (role = 'admin' or (role = 'volunteer' and is_approved = true))
    )
  );

-- Storage Bucket Setup (You need to create bucket 'inquiry_attachments' in Supabase dashboard or via extensions if applicable)
-- For now, we assume the bucket exists. Policies for storage.objects would need to be set in the Supabase Dashboard or via specific storage SQL api if enabled.
-- Example Storage Policy (Conceptual):
-- allow public insert to bucket 'inquiry_attachments'
-- allow staff select from bucket 'inquiry_attachments'


