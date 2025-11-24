import { createClient } from "@/lib/supabase/server"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { Inquiry } from "@/lib/types"

export default async function InquiriesPage() {
  const supabase = await createClient()
  
  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching inquiries:", error)
    return <div>Error loading inquiries</div>
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">פניות</h2>
          <p className="text-muted-foreground">
            רשימת כל הפניות שהתקבלו במערכת
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={inquiries as Inquiry[]} />
    </div>
  )
}

