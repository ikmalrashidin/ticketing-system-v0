"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { updateTicketStatus } from "@/lib/tickets"
import { useToast } from "@/hooks/use-toast"
import type { Ticket } from "@/types"

const formSchema = z.object({
  status: z.enum(["Open", "In Progress", "Solved"]),
})

interface StatusUpdateFormProps {
  ticketId: string
  currentStatus: string
  onUpdate: (ticket: Ticket) => void
}

export default function StatusUpdateForm({ ticketId, currentStatus, onUpdate }: StatusUpdateFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: currentStatus as "Open" | "In Progress" | "Solved",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.status === currentStatus) {
      return
    }

    setIsSubmitting(true)
    try {
      const updatedTicket = await updateTicketStatus(ticketId, values.status)

      toast({
        title: "Status updated",
        description: `Ticket status has been updated to ${values.status}.`,
      })

      onUpdate(updatedTicket)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update ticket status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Solved">Solved</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Status"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
