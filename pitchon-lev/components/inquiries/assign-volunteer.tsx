"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { assignVolunteer } from "@/app/actions/inquiry"
import { toast } from "sonner"
import { Loader2, UserPlus } from "lucide-react"

interface Volunteer {
  id: string
  full_name: string
}

interface AssignVolunteerProps {
  inquiryId: string
  volunteers: Volunteer[]
  assignedVolunteerIds: string[]
}

export function AssignVolunteer({ inquiryId, volunteers, assignedVolunteerIds }: AssignVolunteerProps) {
  const [selectedVolunteer, setSelectedVolunteer] = useState<string>("")
  const [isPending, startTransition] = useTransition()

  const unassignedVolunteers = volunteers.filter(v => !assignedVolunteerIds.includes(v.id))

  function onAssign() {
    if (!selectedVolunteer) return

    startTransition(async () => {
      const result = await assignVolunteer(inquiryId, selectedVolunteer)
      if (result.error) {
        toast.error("שגיאה", { description: result.error })
      } else {
        toast.success("מתנדב שויך בהצלחה")
        setSelectedVolunteer("")
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select value={selectedVolunteer} onValueChange={setSelectedVolunteer}>
          <SelectTrigger className="w-full text-right">
            <SelectValue placeholder="בחר מתנדב לשיוך..." />
          </SelectTrigger>
          <SelectContent>
            {unassignedVolunteers.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.full_name}
              </SelectItem>
            ))}
            {unassignedVolunteers.length === 0 && (
                <div className="p-2 text-sm text-muted-foreground text-center">אין מתנדבים זמינים</div>
            )}
          </SelectContent>
        </Select>
        <Button onClick={onAssign} disabled={isPending || !selectedVolunteer}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
        </Button>
      </div>
      
      <div>
          <h4 className="text-sm font-medium mb-2">מתנדבים משויכים:</h4>
          {assignedVolunteerIds.length === 0 && <p className="text-sm text-muted-foreground">אין משויכים.</p>}
          <ul className="space-y-1">
              {volunteers.filter(v => assignedVolunteerIds.includes(v.id)).map(v => (
                  <li key={v.id} className="text-sm bg-secondary p-2 rounded-md flex justify-between">
                      {v.full_name}
                  </li>
              ))}
          </ul>
      </div>
    </div>
  )
}

