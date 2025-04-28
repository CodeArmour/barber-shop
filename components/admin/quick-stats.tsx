import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Appointment } from "@/types/appointment";

type QuickStatsProps = {
  appointments: Appointment[];
  completedAppointments: number;
  cancelledAppointments: number;
  totalAppointments: number;
};

export function QuickStats({
  appointments,
  completedAppointments,
  cancelledAppointments,
  totalAppointments,
}: QuickStatsProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Quick Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-stone-500">
              Completion Rate
            </p>
            <p className="text-xl md:text-2xl font-bold">
              {appointments.length > 0
                ? Math.round((completedAppointments / totalAppointments) * 100)
                : 0}
              %
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-stone-500">
              Cancellation Rate
            </p>
            <p className="text-xl md:text-2xl font-bold">
              {appointments.length > 0
                ? Math.round((cancelledAppointments / totalAppointments) * 100)
                : 0}
              %
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-stone-500">Total Revenue</p>
            <p className="text-xl md:text-2xl font-bold">
              $
              {appointments
                .filter((a) => a.status === "COMPLETED")
                .reduce((sum, a) => sum + Number(a.service?.price ?? 0), 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
