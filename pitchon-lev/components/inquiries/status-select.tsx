"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InquiryStatus } from "@/lib/types"
import { updateInquiryStatus } from "@/app/actions/inquiry"
import { toast } from "sonner"
import { useState, useTransition } from "react"

interface StatusSelectProps {
  inquiryId: string
  currentStatus: InquiryStatus
}

export function StatusSelect({ inquiryId, currentStatus }: StatusSelectProps) {
  const [status, setStatus] = useState<InquiryStatus>(currentStatus)
  const [isPending, startTransition] = useTransition()

  function onValueChange(value: string) {
    const newStatus = value as InquiryStatus
    setStatus(newStatus)
    
    startTransition(async () => {
      const result = await updateInquiryStatus(inquiryId, newStatus)
      if (result.error) {
        toast.error("שגיאה", { description: result.error })
        setStatus(currentStatus) // Revert
      } else {
        toast.success("הסטטוס עודכן")
      }
    })
  }

  return (
    <Select value={status} onValueChange={onValueChange} disabled={isPending}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="בחר סטטוס" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="received">התקבלה</SelectItem>
        <SelectItem value="in_treatment">בטיפול</SelectItem>
        <SelectItem value="awaiting_docs">ממתין למסמכים</SelectItem>
        <SelectItem value="closed">סגור</SelectItem>
      </SelectContent>
    </Select>
  )
}

