"use client";

import { useEffect, useState } from "react";

import { Header } from "@/components/layout/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppointmentsSection } from "@/sections/admin/appointments-section";
import { CalendarSection } from "@/sections/admin/calendar-section";
import { DashboardSection } from "@/sections/admin/dashboard-section";

import { Appointment } from "@/types/appointment";
import { getAppointments } from "@/actions/appointment-actions";

export default function AdminPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      try {
        const response = await getAppointments();
        if (response.success && response.data) {
          setAppointments(response.data.appointments);
          console.log("Appointments loaded:", response.data.appointments);
        } else {
          console.error("Failed to fetch appointments:", response.error);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
      setLoading(false);
    }

    loadAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <Header isAdmin />
      <main className="container mx-auto px-4 py-6 md:py-8">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="w-full justify-start overflow-x-auto flex-nowrap whitespace-nowrap">
            <TabsTrigger value="dashboard" className="flex-shrink-0">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex-shrink-0">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex-shrink-0">
              Appointments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardSection appointments={appointments} />
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarSection appointments={appointments} />
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentsSection
              appointments={appointments}
              setAppointments={setAppointments}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
