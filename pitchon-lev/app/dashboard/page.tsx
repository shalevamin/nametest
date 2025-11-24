import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AlertTriangle, CheckCircle, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch Profile to check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!profile || (!profile.is_approved && profile.role !== 'admin')) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-6 text-center p-4">
        <div className="bg-yellow-100 p-6 rounded-full">
            <Clock className="h-16 w-16 text-yellow-600" />
        </div>
        <div className="space-y-2 max-w-md">
            <h1 className="text-3xl font-bold text-slate-900">החשבון ממתין לאישור</h1>
            <p className="text-muted-foreground text-lg">
            תודה שנרשמת לצוות המתנדבים של פתחון לב.
            <br />
            מנהל המערכת בודק כעת את פרטיך ויאשר את הגישה בקרוב.
            </p>
        </div>
        <Button variant="outline" asChild>
            <Link href="/">חזרה לדף הבית</Link>
        </Button>
      </div>
    )
  }

  // Stats Queries
  const { count: totalCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })

  const { count: openCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in("status", ["received", "in_treatment", "awaiting_docs"])

    const { count: urgentCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .in("priority", ["high", "critical"])
    .neq("status", "closed")

  const { count: closedCount } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true })
    .eq("status", "closed")

  // 7-Day Inactivity Logic
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  
  const { data: neglectedInquiries } = await supabase
    .from("inquiries")
    .select("id, subject, updated_at, submitter_name")
    .lt("updated_at", sevenDaysAgo)
    .neq("status", "closed")
    .limit(5)

  const neglectedCount = neglectedInquiries?.length || 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">לוח בקרה</h2>
        <p className="text-muted-foreground text-lg">
            שלום, <span className="font-medium text-foreground">{profile.full_name}</span>
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">סה״כ פניות</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{totalCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">פניות פתוחות</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{openCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">פניות דחופות</CardTitle>
             <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{urgentCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">בטיפול או חדשות</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm hover:shadow-md transition-shadow">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">טופלו בהצלחה</CardTitle>
             <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{closedCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      {neglectedCount > 0 ? (
        <div className="space-y-4 bg-red-50/50 p-6 rounded-xl border border-red-100">
            <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                <div className="bg-red-100 p-1.5 rounded-full">
                     <AlertTriangle className="h-5 w-5" />
                </div>
                פניות הדורשות תשומת לב (מעל 7 ימים ללא עדכון)
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {neglectedInquiries?.map((inq) => (
                    <Card key={inq.id} className="border-red-200 bg-white hover:border-red-300 transition-colors">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">{inq.subject}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground flex justify-between">
                                    <span>פונה:</span>
                                    <span className="font-medium text-foreground">{inq.submitter_name}</span>
                                </p>
                                <p className="text-xs text-muted-foreground flex justify-between">
                                    <span>עודכן לאחרונה:</span>
                                    <span>{new Date(inq.updated_at).toLocaleDateString("he-IL")}</span>
                                </p>
                            </div>
                            <Button variant="secondary" size="sm" className="mt-4 w-full bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-100" asChild>
                                <Link href={`/dashboard/inquiries/${inq.id}`}>עבור לטיפול</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      ) : (
        <div className="bg-green-50/50 p-6 rounded-xl border border-green-100 flex items-center gap-4 text-green-800">
             <div className="bg-green-100 p-2 rounded-full">
                 <CheckCircle className="h-6 w-6" />
             </div>
             <div>
                 <h3 className="font-semibold">מצוין! אין פניות מוזנחות</h3>
                 <p className="text-sm opacity-80">כל הפניות טופלו או עודכנו בשבוע האחרון.</p>
             </div>
        </div>
      )}
    </div>
  )
}
