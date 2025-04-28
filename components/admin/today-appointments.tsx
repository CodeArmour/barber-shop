import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Appointment } from "@/types/appointment";

type TodayAppointmentsProps = {
  appointments: Appointment[];
  getStatusColor: (status: string) => string;
};

export function TodayAppointments({
  appointments,
  getStatusColor,
}: TodayAppointmentsProps) {
  return (
    <Card className="lg:col-span-2 shadow-sm">
      <CardHeader>
        <CardTitle>Today's Appointments</CardTitle>
        <CardDescription>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Time</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Service
                  </TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="text-xs md:text-sm">
                      {appointment.time}
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      {appointment.customerName}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs md:text-sm">
                      {appointment.service?.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          appointment.status
                        )}`}
                      >
                        {appointment.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-stone-500">
            No appointments scheduled for today
          </div>
        )}
      </CardContent>
    </Card>
  );
}
