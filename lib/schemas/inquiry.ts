import { z } from "zod";

export const inquirySchema = z.object({
  full_name: z.string().min(2, "שם מלא חייב להכיל לפחות 2 תווים"),
  email: z.string().email("כתובת אימייל לא תקינה"),
  phone: z
    .string()
    .regex(/^05\d{8}$/, "מספר טלפון חייב להיות תקין (לדוגמה: 0501234567)"),
  subject: z.string().min(3, "נושא הפנייה חייב להכיל לפחות 3 תווים"),
  description: z.string().min(10, "תיאור הפנייה חייב להכיל לפחות 10 תווים"),
  priority: z.enum(["low", "medium", "high", "critical"], {
    required_error: "יש לבחור דחיפות",
  }),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;

