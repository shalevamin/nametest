import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PublicInquiryForm } from "@/components/forms/public-inquiry-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartHandshake, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Header / Nav */}
      <header className="absolute top-0 left-0 right-0 z-10 w-full">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
             <div className="font-bold text-2xl text-white tracking-tight">
                פתחון לב
             </div>
             <Button 
                asChild 
                variant="secondary" 
                className="bg-white/10 text-white hover:bg-white hover:text-blue-900 border border-white/20 backdrop-blur-sm transition-all duration-300"
             >
                <Link href="/login" className="font-medium">
                   כניסת צוות
                </Link>
            </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-900 to-blue-800 text-white pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            פתחון לב - מוקד סיוע ופניות הציבור
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            אנחנו כאן בשבילך. אם נתקלת בקושי, בבעיה בירוקרטית או בצורך בסיוע, המתנדבים שלנו עומדים לרשותך.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button size="lg" variant="secondary" asChild className="font-bold text-blue-900 bg-white hover:bg-blue-50">
              <a href="#inquiry-form">פתח פנייה חדשה</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-50 py-12 px-4">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Info */}
          <div className="space-y-8 lg:col-span-1">
             <div className="space-y-6">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">סודיות מובטחת</h3>
                        <p className="text-muted-foreground text-sm">כל הפניות מטופלות בדיסקרטיות מלאה ע״י צוות מוסמך.</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-orange-700" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">ליווי אישי</h3>
                        <p className="text-muted-foreground text-sm">מתנדב אישי ילווה את הפנייה שלך עד למציאת פתרון.</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                        <HeartHandshake className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">סיוע ללא עלות</h3>
                        <p className="text-muted-foreground text-sm">השירות ניתן בהתנדבות מלאה וללא כל תשלום.</p>
                    </div>
                </div>
             </div>

             <Card className="bg-blue-950 text-white border-none">
                <CardHeader>
                    <CardTitle>זקוקים לעזרה דחופה?</CardTitle>
                    <CardDescription className="text-blue-200">מוקד חירום פעיל 24/7</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mb-2">*XXXX</div>
                    <p className="text-sm text-blue-200">חייגו אלינו בכל שעה למקרים דחופים.</p>
                </CardContent>
             </Card>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2" id="inquiry-form">
            <Card className="border-t-4 border-t-blue-600 shadow-lg">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl">טופס פנייה מקוון</CardTitle>
                    <CardDescription>מלאו את הפרטים ונחזור אליכם בהקדם</CardDescription>
                </CardHeader>
                <CardContent>
                    <PublicInquiryForm />
                </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 text-center text-sm">
        <div className="container mx-auto">
            <p>© {new Date().getFullYear()} פתחון לב. כל הזכויות שמורות.</p>
            <p className="mt-2">נבנה באהבה ע״י מתנדבים.</p>
        </div>
      </footer>
    </div>
  );
}
