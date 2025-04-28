import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type DashboardStatsProps = {
  totalAppointments: number
  pendingAppointments: number
  confirmedAppointments: number
  completedAppointments: number
}

export function DashboardStats({
  totalAppointments,
  pendingAppointments,
  confirmedAppointments,
  completedAppointments,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
      <Card className="stat-card">
        <CardHeader className="pb-3">
          <CardTitle className="stat-title">Total Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="stat-value">{totalAppointments}</div>
        </CardContent>
      </Card>

      <Card className="stat-card">
        <CardHeader className="pb-3">
          <CardTitle className="stat-title">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="stat-value-pending">{pendingAppointments}</div>
        </CardContent>
      </Card>

      <Card className="stat-card">
        <CardHeader className="pb-3">
          <CardTitle className="stat-title">Confirmed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="stat-value-confirmed">{confirmedAppointments}</div>
        </CardContent>
      </Card>

      <Card className="stat-card">
        <CardHeader className="pb-3">
          <CardTitle className="stat-title">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="stat-value-completed">{completedAppointments}</div>
        </CardContent>
      </Card>
    </div>
  )
}
