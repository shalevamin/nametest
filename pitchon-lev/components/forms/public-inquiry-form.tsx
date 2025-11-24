'use client'

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inquirySchema, type InquiryFormValues } from "@/lib/schemas/inquiry"
import { createInquiry } from "@/app/actions/inquiry"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function PublicInquiryForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      subject: "",
      description: "",
      priority: "low",
    },
  })

  function onSubmit(data: InquiryFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append("full_name", data.full_name)
      formData.append("email", data.email)
      formData.append("phone", data.phone)
      formData.append("subject", data.subject)
      formData.append("description", data.description)
      formData.append("priority", data.priority)

      const result = await createInquiry(formData)

      if (result.error) {
        toast.error("שגיאה", {
          description: result.error,
        })
      } else {
        toast.success("הפנייה נשלחה", {
          description: result.message,
        })
        form.reset()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-right">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>שם מלא</FormLabel>
                <FormControl>
                  <Input placeholder="ישראל ישראלי" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>טלפון</FormLabel>
                <FormControl>
                  <Input placeholder="0500000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>אימייל</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
                <FormItem>
                <FormLabel>נושא הפנייה</FormLabel>
                <FormControl>
                    <Input placeholder="בקשה לסיוע ב..." {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />

            <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
                <FormItem>
                <FormLabel>דחיפות</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="בחר דחיפות" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <SelectItem value="low">רגילה</SelectItem>
                    <SelectItem value="medium">בינונית</SelectItem>
                    <SelectItem value="high">גבוהה</SelectItem>
                    <SelectItem value="critical">קריטית</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>פירוט הפנייה</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="אנא פרט ככל הניתן..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          שלח פנייה
        </Button>
      </form>
    </Form>
  )
}

