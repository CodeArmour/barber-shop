"use client";

import { CalendarView } from "@/components/admin/calendar-view";

import type { Appointment } from "@/types/appointment";

type CalendarSectionProps = {
  appointments: Appointment[];
};

export function CalendarSection({ appointments }: CalendarSectionProps) {
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <CalendarView appointments={appointments} getStatusColor={getStatusColor} />
  );
}
