'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signup } from "@/app/actions/auth"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"

export default function SignupPage() {
  const [state, action, isPending] = useActionState(signup, undefined)
  const searchParams = useSearchParams()
  const [isAdminMode, setIsAdminMode] = useState(false)

  useEffect(() => {
    if (searchParams.get('type') === 'admin') {
        setIsAdminMode(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error)
    }
  }, [state])

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
       <div className="hidden bg-muted lg:block order-last relative">
         <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-slate-900 flex items-center justify-center p-10">
            <div className="text-white text-center max-w-lg">
                 <h2 className="text-4xl font-bold mb-6">הצטרף לקהילת המתנדבים</h2>
                 <p className="text-lg text-blue-100 mb-8">
                   בפתחון לב אנחנו מאמינים שלכל אדם מגיעה הזדמנות שווה. הצטרף אלינו ועזור לנו לתת מענה לאלו הזקוקים לכך ביותר.
                 </p>
                 <div className="grid grid-cols-2 gap-4 text-sm opacity-80">
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                        <span className="block font-bold text-xl mb-1">100+</span>
                        מתנדבים פעילים
                    </div>
                    <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                        <span className="block font-bold text-xl mb-1">24/7</span>
                        זמינות למערכת
                    </div>
                 </div>
            </div>
         </div>
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-blue-950">
                {isAdminMode ? "הרשמת מנהל מערכת" : "הרשמה"}
            </h1>
            <p className="text-balance text-muted-foreground">
              {isAdminMode ? "הזן את קוד המנהל כדי להירשם" : "צור חשבון חדש כדי להתחיל להתנדב"}
            </p>
          </div>
          <form action={action} className="grid gap-4">
             <div className="grid gap-2">
              <Label htmlFor="full_name">שם מלא</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="ישראל ישראלי"
                required
                disabled={isPending}
              />
            </div>
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
              <div className="flex items-center">
                <Label htmlFor="password">סיסמה</Label>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                minLength={6} 
                disabled={isPending}
              />
              <p className="text-xs text-muted-foreground mt-1">לפחות 6 תווים</p>
            </div>

            {isAdminMode && (
                <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="adminCode">קוד מנהל</Label>
                    <Input 
                        id="adminCode" 
                        name="adminCode" 
                        type="password" 
                        placeholder="הזן קוד סודי..."
                        required 
                        disabled={isPending}
                    />
                </div>
            )}
            
            {state?.error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md text-center">
                {state.error}
              </div>
            )}

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  נרשם...
                </>
              ) : (
                isAdminMode ? "צור חשבון מנהל" : "הרשם"
              )}
            </Button>
          </form>
          
          {!isAdminMode && (
             <div className="text-center">
                <button 
                    type="button"
                    onClick={() => setIsAdminMode(true)}
                    className="text-xs text-muted-foreground hover:underline"
                >
                    הרשמת מנהל
                </button>
             </div>
          )}

           {isAdminMode && (
             <div className="text-center">
                <button 
                    type="button"
                    onClick={() => setIsAdminMode(false)}
                    className="text-xs text-muted-foreground hover:underline"
                >
                    חזרה להרשמה רגילה
                </button>
             </div>
          )}

          <div className="mt-4 text-center text-sm">
            כבר יש לך חשבון?{" "}
            <Link href="/login" className="underline text-blue-600 hover:text-blue-800">
              התחבר
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
