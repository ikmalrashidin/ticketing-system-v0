import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import TicketList from "@/components/ticket-list"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function OperationDashboard() {
  const user = getUser()

  // Ensure only operation staff can access this page
  if (!user || user.role !== "OperationStaff") {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Tickets</h1>
        <Link href="/dashboard/operation/create-ticket">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Ticket
          </Button>
        </Link>
      </div>

      <TicketList userId={user.id} />
    </div>
  )
}
