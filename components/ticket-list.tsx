"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTickets } from "@/lib/tickets"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Ticket } from "@/types"
import { formatDate } from "@/lib/utils"

interface TicketListProps {
  userId?: string
  department?: string
  status?: string
  isAdmin?: boolean
}

export default function TicketList({ userId, department, status, isAdmin = false }: TicketListProps) {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const fetchedTickets = await getTickets({
          userId,
          department,
          status,
        })
        setTickets(fetchedTickets)
      } catch (error) {
        console.error("Error fetching tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [userId, department, status])

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

  if (loading) {
    return <div className="text-center p-4">Loading tickets...</div>
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No tickets found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            {isAdmin && <TableHead>Creator</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell className="font-medium">
                <Link href={`/dashboard/ticket/${ticket.id}`} className="text-blue-600 hover:underline">
                  #{ticket.id.substring(0, 8)}
                </Link>
              </TableCell>
              <TableCell>{ticket.subject}</TableCell>
              <TableCell>{ticket.department}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
              </TableCell>
              <TableCell>{formatDate(ticket.createdAt)}</TableCell>
              {isAdmin && <TableCell>{ticket.creatorName}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
