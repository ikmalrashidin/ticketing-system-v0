import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import TicketForm from "@/components/ticket-form"

export default function CreateTicketPage() {
  const user = getUser()

  // Ensure only operation staff can access this page
  if (!user || user.role !== "OperationStaff") {
    redirect("/")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Ticket</h1>
      <TicketForm userId={user.id} />
    </div>
  )
}
