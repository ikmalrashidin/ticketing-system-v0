"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getUser } from "@/lib/auth"
import { getTicketById } from "@/lib/tickets"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CommentBox from "@/components/comment-box"
import CommentList from "@/components/comment-list"
import StatusUpdateForm from "@/components/status-update-form"
import { ArrowLeft, Paperclip } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Ticket } from "@/types"

export default function TicketDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }

    const fetchTicket = async () => {
      try {
        const ticketData = await getTicketById(id as string)

        // Check access permissions
        if (user.role === "OperationStaff" && ticketData.creatorId !== user.id) {
          router.push("/dashboard/operation")
          return
        }

        if (user.role === "HQ" && ticketData.department !== user.department) {
          router.push("/dashboard/hq")
          return
        }

        setTicket(ticketData)
      } catch (error) {
        console.error("Error fetching ticket:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTicket()
  }, [id, router, user])

  if (loading) {
    return <div className="flex justify-center p-8">Loading ticket details...</div>
  }

  if (!ticket) {
    return <div className="flex justify-center p-8">Ticket not found</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-500"
      case "In Progress":
        return "bg-yellow-500"
      case "Solved":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Ticket Details</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{ticket.subject}</CardTitle>
          <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-500">Department</p>
              <p>{ticket.department}</p>
            </div>
            <div>
              <p className="font-medium text-gray-500">Created</p>
              <p>{formatDate(ticket.createdAt)}</p>
            </div>
            {ticket.solvedAt && (
              <div>
                <p className="font-medium text-gray-500">Solved</p>
                <p>{formatDate(ticket.solvedAt)}</p>
              </div>
            )}
          </div>

          <div>
            <p className="font-medium text-gray-500">Details</p>
            <p className="mt-1 whitespace-pre-wrap">{ticket.details}</p>
          </div>

          {ticket.attachmentUrl && (
            <div>
              <p className="font-medium text-gray-500">Attachment</p>
              <a
                href={ticket.attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center text-blue-600 hover:underline"
              >
                <Paperclip className="mr-1 h-4 w-4" />
                View Attachment
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {(user.role === "HQ" || user.role === "Admin") && ticket.status !== "Solved" && (
        <StatusUpdateForm
          ticketId={ticket.id}
          currentStatus={ticket.status}
          onUpdate={(updatedTicket) => setTicket(updatedTicket)}
        />
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Comments</h2>
        <CommentList ticketId={ticket.id} />
        <CommentBox ticketId={ticket.id} />
      </div>
    </div>
  )
}
