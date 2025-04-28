"use client";

import type React from "react";

import { AppointmentsTable } from "@/components/admin/appointments-table";

import type { Appointment } from "@/types/appointment";

type AppointmentsSectionProps = {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
};

export function AppointmentsSection({
  appointments,
  setAppointments,
}: AppointmentsSectionProps) {
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
    <AppointmentsTable
      appointments={appointments}
      setAppointments={setAppointments}
      getStatusColor={getStatusColor}
    />
  );
}
