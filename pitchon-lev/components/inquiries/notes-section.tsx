"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { InquiryNote } from "@/lib/types"
import { addInquiryNote } from "@/app/actions/inquiry"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NotesSectionProps {
  inquiryId: string
  notes: InquiryNote[]
}

export function NotesSection({ inquiryId, notes }: NotesSectionProps) {
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return

    startTransition(async () => {
      const result = await addInquiryNote(inquiryId, content)
      if (result.error) {
        toast.error("שגיאה", { description: result.error })
      } else {
        toast.success("הערה נוספה")
        setContent("")
      }
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">הערות פנימיות</h3>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto p-1">
        {notes.length === 0 && <p className="text-sm text-muted-foreground">אין הערות עדיין.</p>}
        {notes.map((note) => (
          <div key={note.id} className="flex gap-3 text-sm border-b pb-2">
             <Avatar className="h-8 w-8">
                <AvatarFallback>{note.profiles?.full_name?.substring(0, 1) || "?"}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
                <div className="flex justify-between">
                    <span className="font-medium">{note.profiles?.full_name || "משתמש"}</span>
                    <span className="text-xs text-muted-foreground">{new Date(note.created_at).toLocaleString("he-IL")}</span>
                </div>
                <p className="mt-1">{note.content}</p>
             </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSubmit} className="space-y-2">
        <Textarea
          placeholder="הוסף הערה..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button type="submit" size="sm" disabled={isPending || !content.trim()}>
          {isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          הוסף הערה
        </Button>
      </form>
    </div>
  )
}

