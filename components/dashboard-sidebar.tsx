"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, PlusCircle, Inbox, Users, BarChart, LogOut } from "lucide-react"
import { getUser, logout } from "@/lib/auth"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DashboardSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const user = getUser()

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
          </div>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {user.role === "OperationStaff" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/operation"} tooltip="Dashboard">
                  <Link href="/dashboard/operation">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/operation/create-ticket"}
                  tooltip="Create Ticket"
                >
                  <Link href="/dashboard/operation/create-ticket">
                    <PlusCircle />
                    <span>Create Ticket</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}

          {user.role === "HQ" && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard/hq"} tooltip="Department Tickets">
                <Link href="/dashboard/hq">
                  <Inbox />
                  <span>Department Tickets</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

          {user.role === "Admin" && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin"} tooltip="Dashboard">
                  <Link href="/dashboard/admin">
                    <BarChart />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard/admin/users"} tooltip="Users">
                  <Link href="/dashboard/admin/users">
                    <Users />
                    <span>Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
