import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import TicketList from "@/components/ticket-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HQDashboard() {
  const user = getUser()

  // Ensure only HQ staff can access this page
  if (!user || user.role !== "HQ" || !user.department) {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Department Tickets</h1>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="solved">Solved</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <TicketList department={user.department} status="Open" />
        </TabsContent>
        <TabsContent value="in-progress">
          <TicketList department={user.department} status="In Progress" />
        </TabsContent>
        <TabsContent value="solved">
          <TicketList department={user.department} status="Solved" />
        </TabsContent>
        <TabsContent value="all">
          <TicketList department={user.department} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
