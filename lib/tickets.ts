import { v4 as uuidv4 } from "uuid"
import type { Ticket } from "@/types"
import { getUserById } from "@/lib/users"

// Mock tickets for demonstration
let MOCK_TICKETS: Ticket[] = [
  {
    id: "ticket1",
    subject: "Need help with payroll system",
    details: "I'm having trouble accessing the payroll system. It keeps showing an error when I try to log in.",
    status: "Open",
    department: "Finance",
    creatorId: "user1",
    createdAt: "2023-06-10T10:30:00Z",
  },
  {
    id: "ticket2",
    subject: "Request for new equipment",
    details: "My laptop is very slow and affecting my productivity. Can I get a new one?",
    status: "In Progress",
    department: "IT",
    creatorId: "user1",
    createdAt: "2023-06-08T14:15:00Z",
  },
  {
    id: "ticket3",
    subject: "Question about vacation policy",
    details: "I'm planning to take a vacation next month. What's the process for requesting time off?",
    status: "Solved",
    department: "HR",
    creatorId: "user5",
    createdAt: "2023-06-05T09:45:00Z",
    solvedAt: "2023-06-07T11:20:00Z",
  },
  {
    id: "ticket4",
    subject: "Issue with client database",
    details:
      "The client database is showing incorrect information for some clients. This is causing confusion when communicating with them.",
    status: "Open",
    department: "IT",
    creatorId: "user5",
    createdAt: "2023-06-11T16:00:00Z",
  },
  {
    id: "ticket5",
    subject: "Need clarification on expense policy",
    details: "I'm not sure which expenses are reimbursable under the new policy. Can someone clarify?",
    status: "In Progress",
    department: "Finance",
    creatorId: "user1",
    createdAt: "2023-06-09T11:30:00Z",
  },
]

// In a real app, you would use a database
// This is just a simple mock implementation using memory

export async function getTickets({
  userId,
  department,
  status,
}: {
  userId?: string
  department?: string
  status?: string
}): Promise<Ticket[]> {
  // Get tickets from localStorage if available
  const storedTickets = localStorage.getItem("tickets")
  if (storedTickets) {
    MOCK_TICKETS = JSON.parse(storedTickets)
  } else {
    // Store initial tickets in localStorage
    localStorage.setItem("tickets", JSON.stringify(MOCK_TICKETS))
  }

  // Filter tickets based on parameters
  let filteredTickets = [...MOCK_TICKETS]

  if (userId) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.creatorId === userId)
  }

  if (department) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.department === department)
  }

  if (status) {
    filteredTickets = filteredTickets.filter((ticket) => ticket.status === status)
  }

  // Sort tickets by creation date (newest first)
  filteredTickets.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Add creator name to each ticket
  const ticketsWithCreatorName = await Promise.all(
    filteredTickets.map(async (ticket) => {
      const creator = await getUserById(ticket.creatorId)
      return {
        ...ticket,
        creatorName: creator?.name || "Unknown User",
      }
    }),
  )

  return ticketsWithCreatorName
}

export async function getTicketById(id: string): Promise<Ticket> {
  // Get tickets from localStorage if available
  const storedTickets = localStorage.getItem("tickets")
  if (storedTickets) {
    MOCK_TICKETS = JSON.parse(storedTickets)
  }

  const ticket = MOCK_TICKETS.find((t) => t.id === id)

  if (!ticket) {
    throw new Error(`Ticket with ID ${id} not found`)
  }

  // Add creator name to the ticket
  const creator = await getUserById(ticket.creatorId)
  return {
    ...ticket,
    creatorName: creator?.name || "Unknown User",
  }
}

export async function createTicket({
  subject,
  details,
  department,
  creatorId,
  attachmentUrl,
}: {
  subject: string
  details: string
  department: string
  creatorId: string
  attachmentUrl?: string | null
}): Promise<Ticket> {
  // Get tickets from localStorage if available
  const storedTickets = localStorage.getItem("tickets")
  if (storedTickets) {
    MOCK_TICKETS = JSON.parse(storedTickets)
  }

  const newTicket: Ticket = {
    id: uuidv4(),
    subject,
    details,
    status: "Open",
    department,
    creatorId,
    createdAt: new Date().toISOString(),
    attachmentUrl: attachmentUrl || undefined,
  }

  // Add new ticket to the list
  MOCK_TICKETS.push(newTicket)

  // Update localStorage
  localStorage.setItem("tickets", JSON.stringify(MOCK_TICKETS))

  return newTicket
}

export async function updateTicketStatus(id: string, status: string): Promise<Ticket> {
  // Get tickets from localStorage if available
  const storedTickets = localStorage.getItem("tickets")
  if (storedTickets) {
    MOCK_TICKETS = JSON.parse(storedTickets)
  }

  const ticketIndex = MOCK_TICKETS.findIndex((t) => t.id === id)

  if (ticketIndex === -1) {
    throw new Error(`Ticket with ID ${id} not found`)
  }

  // Update ticket status
  MOCK_TICKETS[ticketIndex] = {
    ...MOCK_TICKETS[ticketIndex],
    status,
    // If status is "Solved", add solvedAt timestamp
    ...(status === "Solved" && { solvedAt: new Date().toISOString() }),
  }

  // Update localStorage
  localStorage.setItem("tickets", JSON.stringify(MOCK_TICKETS))

  // Add creator name to the updated ticket
  const creator = await getUserById(MOCK_TICKETS[ticketIndex].creatorId)
  return {
    ...MOCK_TICKETS[ticketIndex],
    creatorName: creator?.name || "Unknown User",
  }
}

export async function getTicketStats() {
  // Get tickets from localStorage if available
  const storedTickets = localStorage.getItem("tickets")
  if (storedTickets) {
    MOCK_TICKETS = JSON.parse(storedTickets)
  }

  // Calculate total tickets by status
  const totalTickets = MOCK_TICKETS.length
  const openTickets = MOCK_TICKETS.filter((t) => t.status === "Open").length
  const inProgressTickets = MOCK_TICKETS.filter((t) => t.status === "In Progress").length
  const solvedTickets = MOCK_TICKETS.filter((t) => t.status === "Solved").length

  // Calculate tickets by department
  const departmentCounts: Record<string, number> = {}
  MOCK_TICKETS.forEach((ticket) => {
    if (!departmentCounts[ticket.department]) {
      departmentCounts[ticket.department] = 0
    }
    departmentCounts[ticket.department]++
  })

  const departmentStats = Object.entries(departmentCounts).map(([department, count]) => ({
    department,
    count,
  }))

  // Calculate ticket age statistics
  const now = new Date()
  const lessThan24h = MOCK_TICKETS.filter((t) => {
    const createdAt = new Date(t.createdAt)
    const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    return t.status !== "Solved" && diffHours < 24
  }).length

  const lessThan48h = MOCK_TICKETS.filter((t) => {
    const createdAt = new Date(t.createdAt)
    const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    return t.status !== "Solved" && diffHours >= 24 && diffHours < 48
  }).length

  const lessThan7d = MOCK_TICKETS.filter((t) => {
    const createdAt = new Date(t.createdAt)
    const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    return t.status !== "Solved" && diffHours >= 48 && diffHours < 168
  }).length

  const moreThan7d = MOCK_TICKETS.filter((t) => {
    const createdAt = new Date(t.createdAt)
    const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60)
    return t.status !== "Solved" && diffHours >= 168
  }).length

  return {
    totalTickets,
    openTickets,
    inProgressTickets,
    solvedTickets,
    departmentStats,
    ageStats: {
      lessThan24h,
      lessThan48h,
      lessThan7d,
      moreThan7d,
    },
  }
}
