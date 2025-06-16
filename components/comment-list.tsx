"use client"

import { useEffect, useState } from "react"
import { getComments } from "@/lib/comments"
import { getUserById } from "@/lib/users"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { Comment } from "@/types"
import { formatDate } from "@/lib/utils"

interface CommentListProps {
  ticketId: string
}

export default function CommentList({ ticketId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await getComments(ticketId)

        // Fetch user details for each comment
        const commentsWithUserDetails = await Promise.all(
          fetchedComments.map(async (comment) => {
            const user = await getUserById(comment.userId)
            return {
              ...comment,
              userName: user?.name || "Unknown User",
              userRole: user?.role || "Unknown Role",
            }
          }),
        )

        setComments(commentsWithUserDetails)
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [ticketId])

  if (loading) {
    return <div className="text-center p-4">Loading comments...</div>
  }

  if (comments.length === 0) {
    return (
      <div className="text-center p-4 border rounded-lg bg-gray-50">
        <p className="text-gray-500">No comments yet</p>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(comment.userName)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{comment.userName}</p>
                <p className="text-xs text-gray-500">
                  {comment.userRole} • {formatDate(comment.createdAt)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="whitespace-pre-wrap">{comment.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
