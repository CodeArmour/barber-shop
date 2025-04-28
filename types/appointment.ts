import type { Barber } from "./barber"
import type { Service } from "./service"

export type AppointmentStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"

export interface Appointment {
  id: number
  date: Date // Use ISO string or Date if needed
  time: string
  barberId: number
  serviceId: number
  customerName: string
  customerEmail: string
  customerPhone?: string
  status: AppointmentStatus
  createdAt: string
  updatedAt: string
  barber?: Barber
  service?: Service
}
