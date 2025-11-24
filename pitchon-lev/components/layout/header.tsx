import Link from 'next/link'
import { Menu, Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle sidebar</span>
      </Button>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
             <span>Pitchon Lev</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
            {/* Placeholder for User Nav / Auth */}
            <Button variant="outline" size="sm">Login</Button>
        </div>
      </div>
    </header>
  )
}

