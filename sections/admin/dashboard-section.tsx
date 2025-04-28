"use client";

import { DashboardStats } from "@/components/admin/dashboard-stats";
import { QuickStats } from "@/components/admin/quick-stats";
import { TodayAppointments } from "@/components/admin/today-appointments";

import type { Appointment } from "@/types/appointment";

type DashboardSectionProps = {
  appointments: Appointment[];
};

export function DashboardSection({ appointments }: DashboardSectionProps) {
  // Get counts for dashboard
  const getTotalAppointments = () => appointments.length;
  const getPendingAppointments = () =>
    appointments.filter((a) => a.status === "PENDING").length;
  const getConfirmedAppointments = () =>
    appointments.filter((a) => a.status === "CONFIRMED").length;
  const getCompletedAppointments = () =>
    appointments.filter((a) => a.status === "COMPLETED").length;
  const getCancelledAppointments = () =>
    appointments.filter((a) => a.status === "CANCELLED").length;

  // Get today's appointments
  const getTodayAppointments = () => {
    const today = new Date().toISOString().split("T")[0];
    return appointments.filter((a) => new Date(a.date).toISOString().split("T")[0] === today);
  };

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
    <>
      <DashboardStats
        totalAppointments={getTotalAppointments()}
        pendingAppointments={getPendingAppointments()}
        confirmedAppointments={getConfirmedAppointments()}
        completedAppointments={getCompletedAppointments()}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TodayAppointments
          appointments={getTodayAppointments()}
          getStatusColor={getStatusColor}
        />

        <QuickStats
          appointments={appointments}
          completedAppointments={getCompletedAppointments()}
          cancelledAppointments={getCancelledAppointments()}
          totalAppointments={getTotalAppointments()}
        />
      </div>
    </>
  );
}
