"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { addComment } from "@/lib/comments"
import { getUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

interface CommentBoxProps {
  ticketId: string
}

export default function CommentBox({ ticketId }: CommentBoxProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const user = getUser()

  if (!user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) {
      return
    }

    setIsSubmitting(true)

    try {
      await addComment({
        ticketId,
        userId: user.id,
        message: comment,
      })

      setComment("")
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      })

      // Force a refresh of the page to show the new comment
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Add your comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-24"
      />
      <Button type="submit" disabled={isSubmitting || !comment.trim()}>
        {isSubmitting ? "Submitting..." : "Add Comment"}
      </Button>
    </form>
  )
}
