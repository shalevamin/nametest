'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions/auth"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useEffect } from "react"

export default function LoginPage() {
  const [state, action, isPending] = useActionState(login, undefined)

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-blue-950">כניסה למערכת</h1>
            <p className="text-balance text-muted-foreground">
              הזן את האימייל שלך כדי להתחבר
            </p>
          </div>
          <form action={action} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">אימייל</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                disabled={isPending}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">סיסמה</Label>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                disabled={isPending}
              />
            </div>

            {state?.error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md text-center">
                {state.error}
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
              {isPending ? (
                 <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  מתחבר...
                </>
              ) : (
                "התחבר"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            אין לך חשבון?{" "}
            <Link href="/signup" className="underline text-blue-600 hover:text-blue-800">
              הרשם כאן
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
         <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-slate-800 flex items-center justify-center p-10">
            <div className="text-white text-center max-w-lg">
                 <h2 className="text-4xl font-bold mb-4">מערכת ניהול פניות</h2>
                 <p className="text-xl text-blue-100">
                    עמוד התחברות מנהלים \ מתנדבים
                 </p>
            </div>
         </div>
      </div>
    </div>
  )
}
