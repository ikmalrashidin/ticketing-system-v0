import { v4 as uuidv4 } from "uuid"
import type { Comment } from "@/types"

// Mock comments for demonstration
let MOCK_COMMENTS: Comment[] = [
  {
    id: "comment1",
    ticketId: "ticket1",
    userId: "user2",
    message: "I'll look into this issue. Can you provide your employee ID so I can check your account?",
    createdAt: "2023-06-10T11:15:00Z",
  },
  {
    id: "comment2",
    ticketId: "ticket1",
    userId: "user1",
    message: "My employee ID is EMP12345. Thank you for your help!",
    createdAt: "2023-06-10T11:30:00Z",
  },
  {
    id: "comment3",
    ticketId: "ticket2",
    userId: "user2",
    message: "We're checking our inventory for available laptops. I'll update you soon.",
    createdAt: "2023-06-08T15:00:00Z",
  },
  {
    id: "comment4",
    ticketId: "ticket3",
    userId: "user4",
    message: "You can request time off through the HR portal. Please submit your request at least 2 weeks in advance.",
    createdAt: "2023-06-05T10:30:00Z",
  },
  {
    id: "comment5",
    ticketId: "ticket3",
    userId: "user5",
    message: "Thank you for the information. I've submitted my request through the portal.",
    createdAt: "2023-06-06T09:15:00Z",
  },
  {
    id: "comment6",
    ticketId: "ticket3",
    userId: "user4",
    message: "Your request has been approved. Enjoy your vacation!",
    createdAt: "2023-06-07T11:00:00Z",
  },
]

// In a real app, you would use a database
// This is just a simple mock implementation using memory

export async function getComments(ticketId: string): Promise<Comment[]> {
  // Get comments from localStorage if available
  const storedComments = localStorage.getItem("comments")
  if (storedComments) {
    MOCK_COMMENTS = JSON.parse(storedComments)
  } else {
    // Store initial comments in localStorage
    localStorage.setItem("comments", JSON.stringify(MOCK_COMMENTS))
  }

  // Filter comments for the specified ticket
  const filteredComments = MOCK_COMMENTS.filter((comment) => comment.ticketId === ticketId)

  // Sort comments by creation date (oldest first)
  filteredComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return filteredComments
}

export async function addComment({
  ticketId,
  userId,
  message,
}: {
  ticketId: string
  userId: string
  message: string
}): Promise<Comment> {
  // Get comments from localStorage if available
  const storedComments = localStorage.getItem("comments")
  if (storedComments) {
    MOCK_COMMENTS = JSON.parse(storedComments)
  }

  const newComment: Comment = {
    id: uuidv4(),
    ticketId,
    userId,
    message,
    createdAt: new Date().toISOString(),
  }

  // Add new comment to the list
  MOCK_COMMENTS.push(newComment)

  // Update localStorage
  localStorage.setItem("comments", JSON.stringify(MOCK_COMMENTS))

  return newComment
}
