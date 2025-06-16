"use client"

import { useEffect, useState } from "react"
import { getTicketStats } from "@/lib/tickets"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface TicketStatsData {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  solvedTickets: number
  departmentStats: {
    department: string
    count: number
  }[]
  ageStats: {
    lessThan24h: number
    lessThan48h: number
    lessThan7d: number
    moreThan7d: number
  }
}

export default function TicketStats() {
  const [stats, setStats] = useState<TicketStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await getTicketStats()
        setStats(statsData)
      } catch (error) {
        console.error("Error fetching ticket stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="text-center p-4">Loading statistics...</div>
  }

  if (!stats) {
    return <div className="text-center p-4">Failed to load statistics</div>
  }

  const departmentChartData = stats.departmentStats.map((item) => ({
    name: item.department,
    value: item.count,
  }))

  const statusChartData = [
    { name: "Open", value: stats.openTickets },
    { name: "In Progress", value: stats.inProgressTickets },
    { name: "Solved", value: stats.solvedTickets },
  ]

  const ageChartData = [
    { name: "< 24h", value: stats.ageStats.lessThan24h },
    { name: "24-48h", value: stats.ageStats.lessThan48h },
    { name: "2-7d", value: stats.ageStats.lessThan7d },
    { name: "> 7d", value: stats.ageStats.moreThan7d },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.openTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.inProgressTickets}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.solvedTickets}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Department</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Age</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
