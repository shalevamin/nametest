import { createClient } from "@/lib/supabase/server"
import { UsersTable } from "@/components/admin/users-table"
import { Profile } from "@/lib/types"
import { redirect } from "next/navigation"

export default async function VolunteersPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify Admin
  const { data: currentUserProfile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (currentUserProfile?.role !== 'admin') {
    return <div className="p-8">אין לך הרשאה לצפות בעמוד זה.</div>
  }

  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    return <div>Error loading users</div>
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ניהול מתנדבים ומשתמשים</h2>
          <p className="text-muted-foreground">
            אישור וחסימת גישה למערכת
          </p>
        </div>
      </div>
      <UsersTable users={users as Profile[]} />
    </div>
  )
}

