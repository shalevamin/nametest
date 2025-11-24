-- Update the handle_new_user function to respect role from metadata
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role, is_approved)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    -- If role is provided in metadata, use it (cast to user_role enum), otherwise default to candidate
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'candidate'),
    -- Auto approve if admin
    (case when (new.raw_user_meta_data->>'role') = 'admin' then true else false end)
  );
  return new;
end;
$$ language plpgsql security definer;

