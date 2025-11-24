import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusSelect } from "@/components/inquiries/status-select"
import { NotesSection } from "@/components/inquiries/notes-section"
import { AssignVolunteer } from "@/components/inquiries/assign-volunteer"
import { FilesSection } from "@/components/inquiries/files-section"
import { Inquiry, InquiryNote, InquiryFile } from "@/lib/types"

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient()

  // Fetch Inquiry
  const { data: inquiry, error } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !inquiry) {
    notFound()
  }

  // Fetch Notes
  const { data: notes } = await supabase
    .from("inquiry_notes")
    .select("*, profiles(full_name)")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: true })

  // Fetch Volunteers List (Active)
  const { data: volunteers } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "volunteer")
    .eq("is_approved", true)

  // Fetch Assignments
  const { data: assignments } = await supabase
    .from("inquiry_assignments")
    .select("user_id")
    .eq("inquiry_id", id)

  // Fetch Files
  const { data: files } = await supabase
    .from("inquiry_files")
    .select("*")
    .eq("inquiry_id", id)
    .order("created_at", { ascending: false })


  const assignedIds = assignments?.map(a => a.user_id) || []

  const safeInquiry = inquiry as Inquiry
  const safeNotes = (notes || []) as InquiryNote[]
  const safeVolunteers = (volunteers || []) as { id: string, full_name: string }[]
  const safeFiles = (files || []) as InquiryFile[]

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{safeInquiry.subject}</h1>
            <p className="text-muted-foreground">
                פונה: {safeInquiry.submitter_name} ({safeInquiry.submitter_phone})
            </p>
        </div>
        <div className="flex items-center gap-2">
             <Badge variant={safeInquiry.priority === 'critical' ? 'destructive' : 'outline'}>
                {safeInquiry.priority}
             </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>פרטי הפנייה</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="font-semibold block mb-1">תיאור:</span>
                        <p className="whitespace-pre-wrap text-sm">{safeInquiry.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold block">אימייל:</span>
                            {safeInquiry.submitter_email}
                        </div>
                        <div>
                            <span className="font-semibold block">טלפון:</span>
                            {safeInquiry.submitter_phone}
                        </div>
                        <div>
                             <span className="font-semibold block">נוצר בתאריך:</span>
                             {new Date(safeInquiry.created_at).toLocaleString("he-IL")}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>הערות</CardTitle>
                </CardHeader>
                <CardContent>
                    <NotesSection inquiryId={safeInquiry.id} notes={safeNotes} />
                </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
             <Card>
                <CardHeader>
                    <CardTitle>ניהול סטטוס</CardTitle>
                </CardHeader>
                <CardContent>
                    <StatusSelect inquiryId={safeInquiry.id} currentStatus={safeInquiry.status} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>שיוך מתנדבים</CardTitle>
                </CardHeader>
                <CardContent>
                    <AssignVolunteer 
                        inquiryId={safeInquiry.id} 
                        volunteers={safeVolunteers}
                        assignedVolunteerIds={assignedIds}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>קבצים</CardTitle>
                </CardHeader>
                <CardContent>
                    <FilesSection inquiryId={safeInquiry.id} files={safeFiles} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  )
}
