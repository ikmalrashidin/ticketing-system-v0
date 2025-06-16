import type React from "react"
import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/")
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
