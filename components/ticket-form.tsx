"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createTicket } from "@/lib/tickets"
import { useToast } from "@/hooks/use-toast"
import { DEPARTMENTS } from "@/config/constants"

const formSchema = z.object({
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  details: z.string().min(10, {
    message: "Details must be at least 10 characters.",
  }),
  department: z.string().min(1, {
    message: "Please select a department.",
  }),
  attachment: z.any().optional(),
})

interface TicketFormProps {
  userId: string
}

export default function TicketForm({ userId }: TicketFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      details: "",
      department: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // In a real app, you would upload the file to a storage service
      // and get a URL back. For now, we'll just use a placeholder.
      let attachmentUrl = null
      if (values.attachment && values.attachment[0]) {
        attachmentUrl = URL.createObjectURL(values.attachment[0])
      }

      await createTicket({
        subject: values.subject,
        details: values.details,
        department: values.department,
        creatorId: userId,
        attachmentUrl,
      })

      toast({
        title: "Ticket created",
        description: "Your ticket has been submitted successfully.",
      })

      router.push("/dashboard/operation")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      form.setValue("attachment", e.target.files)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input placeholder="Brief description of your query" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Details</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide detailed information about your query" className="min-h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="attachment"
          render={() => (
            <FormItem>
              <FormLabel>Attachment (Optional)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input type="file" onChange={handleFileChange} className="hidden" id="file-upload" />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("file-upload")?.click()}
                  >
                    Choose File
                  </Button>
                  <span className="text-sm text-gray-500">{fileName || "No file chosen"}</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Ticket"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
