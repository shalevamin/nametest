export type InquiryStatus = 'received' | 'in_treatment' | 'awaiting_docs' | 'closed';
export type InquiryPriority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'admin' | 'volunteer' | 'candidate';

export interface Inquiry {
  id: string;
  created_at: string;
  updated_at: string;
  status: InquiryStatus;
  priority: InquiryPriority;
  subject: string;
  description: string;
  submitter_name: string;
  submitter_email: string;
  submitter_phone: string;
  is_archived: boolean;
}

export interface InquiryNote {
  id: string;
  inquiry_id: string;
  user_id: string | null;
  content: string;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  is_approved: boolean;
  phone: string | null;
  volunteer_start_date: string | null;
  created_at: string;
}

export interface InquiryFile {
  id: string;
  inquiry_id: string;
  file_path: string;
  file_name: string;
  uploaded_by: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
  } | null;
}
