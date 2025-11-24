"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Profile } from "@/lib/types"
import { toggleUserApproval } from "@/app/actions/admin"
import { toast } from "sonner"
import { useTransition } from "react"

interface UsersTableProps {
  users: Profile[]
}

export function UsersTable({ users }: UsersTableProps) {
  const [isPending, startTransition] = useTransition()

  function onToggle(userId: string, currentStatus: boolean) {
    startTransition(async () => {
      const result = await toggleUserApproval(userId, !currentStatus)
      if (result.error) {
        toast.error("שגיאה", { description: result.error })
      } else {
        toast.success(currentStatus ? "משתמש נחסם" : "משתמש אושר")
      }
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">שם מלא</TableHead>
            <TableHead className="text-right">אימייל</TableHead>
            <TableHead className="text-right">תפקיד</TableHead>
            <TableHead className="text-right">סטטוס</TableHead>
            <TableHead className="text-right">פעולות</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Badge variant="outline">{user.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={user.is_approved ? "default" : "destructive"}>
                  {user.is_approved ? "פעיל" : "ממתין/חסום"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant={user.is_approved ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onToggle(user.id, user.is_approved)}
                  disabled={isPending}
                >
                  {user.is_approved ? "חסום" : "אשר"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

