"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Inquiry } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export const columns: ColumnDef<Inquiry>[] = [
  {
    accessorKey: "submitter_name",
    header: "שם הפונה",
  },
  {
    accessorKey: "subject",
    header: "נושא",
  },
  {
    accessorKey: "priority",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            דחיפות
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string
      const colors: Record<string, string> = {
        low: "bg-gray-500",
        medium: "bg-blue-500",
        high: "bg-orange-500",
        critical: "bg-red-500",
      }
       const labels: Record<string, string> = {
        low: "רגילה",
        medium: "בינונית",
        high: "גבוהה",
        critical: "קריטית",
      }
      return <Badge className={colors[priority]}>{labels[priority]}</Badge>
    },
  },
  {
    accessorKey: "status",
    header: "סטטוס",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
       const labels: Record<string, string> = {
        received: "התקבלה",
        in_treatment: "בטיפול",
        awaiting_docs: "ממתין למסמכים",
        closed: "סגור",
      }
      return <Badge variant="outline">{labels[status]}</Badge>
    },
  },
  {
    accessorKey: "created_at",
    header: "תאריך פתיחה",
    cell: ({ row }) => {
        return new Date(row.getValue("created_at")).toLocaleDateString("he-IL")
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const inquiry = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">פתח תפריט</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>פעולות</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(inquiry.id)}
            >
              העתק מזהה פנייה
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href={`/dashboard/inquiries/${inquiry.id}`}>צפה בפרטים</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

