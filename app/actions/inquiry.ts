'use server'

import { createClient } from "@/lib/supabase/server";
import { inquirySchema } from "@/lib/schemas/inquiry";
import { revalidatePath } from "next/cache";
import { InquiryStatus } from "@/lib/types";

export async function createInquiry(formData: FormData) {
  const rawData = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    description: formData.get("description"),
    priority: formData.get("priority"),
  };

  const validatedFields = inquirySchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "נתונים לא תקינים. אנא בדוק את הטופס.",
      details: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .insert({
      submitter_name: validatedFields.data.full_name,
      submitter_email: validatedFields.data.email,
      submitter_phone: validatedFields.data.phone,
      subject: validatedFields.data.subject,
      description: validatedFields.data.description,
      priority: validatedFields.data.priority,
      status: 'received'
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase Error:", error);
    return {
      error: "אירעה שגיאה בשמירת הפנייה. אנא נסה שנית מאוחר יותר.",
    };
  }

  revalidatePath("/dashboard/inquiries");
  return { success: true, message: "הפנייה התקבלה בהצלחה!", id: inquiry.id };
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return { error: "Failed to update status" };
  }

  revalidatePath(`/dashboard/inquiries/${id}`);
  revalidatePath("/dashboard/inquiries");
  return { success: true };
}

export async function addInquiryNote(inquiryId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("inquiry_notes")
    .insert({
      inquiry_id: inquiryId,
      user_id: user.id,
      content,
    });

  if (error) {
    return { error: "Failed to add note" };
  }

  revalidatePath(`/dashboard/inquiries/${inquiryId}`);
  return { success: true };
}

export async function assignVolunteer(inquiryId: string, userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("inquiry_assignments")
    .insert({
      inquiry_id: inquiryId,
      user_id: userId,
    });

  if (error) {
    if (error.code === '23505') {
        return { error: "Volunteer already assigned" };
    }
    return { error: "Failed to assign volunteer" };
  }

  revalidatePath(`/dashboard/inquiries/${inquiryId}`);
  return { success: true };
}

export async function recordFileUpload(inquiryId: string, filePath: string, fileName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("inquiry_files")
    .insert({
      inquiry_id: inquiryId,
      file_path: filePath,
      file_name: fileName,
      uploaded_by: user.id
    });

  if (error) {
    return { error: "Failed to record file" };
  }

  revalidatePath(`/dashboard/inquiries/${inquiryId}`);
  return { success: true };
}
