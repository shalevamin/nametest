import Link from 'next/link'
import { Home, FileText, Users, Settings, BarChart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            תפריט ראשי
          </h2>
          <div className="space-y-1">
             <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    לוח בקרה
                </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/inquiries">
                    <FileText className="mr-2 h-4 w-4" />
                    פניות
                </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              מתנדבים
            </Button>
             <Button variant="ghost" className="w-full justify-start">
              <BarChart className="mr-2 h-4 w-4" />
              דוחות
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            הגדרות
          </h2>
           <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              כללי
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
