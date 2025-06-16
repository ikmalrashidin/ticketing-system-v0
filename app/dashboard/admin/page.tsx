import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import TicketList from "@/components/ticket-list"
import TicketStats from "@/components/ticket-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminDashboard() {
  const user = getUser()

  // Ensure only admin can access this page
  if (!user || user.role !== "Admin") {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <TicketStats />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="solved">Solved</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TicketList isAdmin={true} />
        </TabsContent>
        <TabsContent value="open">
          <TicketList isAdmin={true} status="Open" />
        </TabsContent>
        <TabsContent value="in-progress">
          <TicketList isAdmin={true} status="In Progress" />
        </TabsContent>
        <TabsContent value="solved">
          <TicketList isAdmin={true} status="Solved" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
