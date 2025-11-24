"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { InquiryFile } from "@/lib/types"
import { recordFileUpload } from "@/app/actions/inquiry"
import { toast } from "sonner"
import { File, Loader2, Upload } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FilesSectionProps {
  inquiryId: string
  files: InquiryFile[]
}

export function FilesSection({ inquiryId, files }: FilesSectionProps) {
  const [isUploading, setIsUploading] = useState(false)
  
  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${inquiryId}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('inquiry_attachments')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const result = await recordFileUpload(inquiryId, filePath, file.name)
      if (result.error) {
        throw new Error(result.error)
      }

      toast.success("קובץ הועלה בהצלחה")
    } catch (error: any) {
      toast.error("שגיאה בהעלאת הקובץ", { description: error.message })
    } finally {
      setIsUploading(false)
      // Reset input
      e.target.value = ''
    }
  }

  async function downloadFile(filePath: string, fileName: string) {
      const supabase = createClient()
      const { data } = supabase.storage.from('inquiry_attachments').getPublicUrl(filePath)
      
      // Open in new tab
      window.open(data.publicUrl, '_blank')
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">קבצים מצורפים</h3>
      
      <div className="space-y-2">
        {files.length === 0 && <p className="text-sm text-muted-foreground">אין קבצים.</p>}
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-2 border rounded-md text-sm">
             <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-blue-500" />
                <span>{file.file_name}</span>
             </div>
             <Button variant="ghost" size="sm" onClick={() => downloadFile(file.file_path, file.file_name)}>
                צפה
             </Button>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            העלה קובץ
        </Label>
        <Input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={onUpload}
            disabled={isUploading}
        />
      </div>
    </div>
  )
}

