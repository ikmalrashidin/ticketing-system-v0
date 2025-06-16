export interface User {
  id: string
  name: string
  role: "OperationStaff" | "HQ" | "Admin"
  department?: string // Only for HQ staff
  username: string
  password?: string // Only used for authentication
}

export interface Ticket {
  id: string
  subject: string
  details: string
  status: "Open" | "In Progress" | "Solved"
  department: string
  creatorId: string
  createdAt: string
  solvedAt?: string
  attachmentUrl?: string
  creatorName?: string // Added when fetching tickets
}

export interface Comment {
  id: string
  ticketId: string
  userId: string
  message: string
  createdAt: string
  userName?: string // Added when fetching comments
  userRole?: string // Added when fetching comments
}
