'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Header } from './header'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-background md:block">
            <div className="flex h-16 items-center border-b px-6">
                <span className="font-bold">Pitchon Lev CRM</span>
            </div>
          <Sidebar />
        </aside>
        <main className="flex-1 flex flex-col">
            <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
            <div className="flex-1 space-y-4 p-8 pt-6">
                {children}
            </div>
        </main>
      </div>
    </div>
  )
}

