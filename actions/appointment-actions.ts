'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { AppointmentStatus } from '@prisma/client'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { createUTCDate, formatISODate } from "@/utils/date-helper";
import { sendAppointmentCancelledEmail, sendAppointmentCompletedEmail, sendAppointmentConfirmation, sendAppointmentConfirmedEmail } from '@/actions/email-actions'
import { sendAppointmentConfirmationResend,
  sendAppointmentCancelledEmailResend,
  sendAppointmentCompletedEmailResend,
  sendAppointmentConfirmedEmailResend } from '@/lib/mail'
// Serialization helper for any object with service that might contain Decimal
const serializeWithService = (item: any) => {
  if (!item) return null;
  
  // Handle service with price if it exists
  if (item.service && item.service.price) {
    return {
      ...item,
      service: {
        ...item.service,
        price: item.service.price.toString(),
      },
      createdAt: item.createdAt ? item.createdAt.toISOString() : null,
      updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
    };
  }
  
  // Handle dates for all items
  return {
    ...item,
    createdAt: item.createdAt ? item.createdAt.toISOString() : null,
    updatedAt: item.updatedAt ? item.updatedAt.toISOString() : null,
  };
};

// Type for creating appointments
type CreateAppointmentData = {
  date: Date
  time: string
  barberId: number
  serviceId: number
  customerName: string
  customerEmail: string
  customerPhone?: string
}

// Type for appointment statistics
type AppointmentStats = {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
  completionRate: number
  cancellationRate: number
  totalRevenue: number
}

/**
 * Create a new appointment
 */
export async function createAppointment(data: CreateAppointmentData) {
  try {
    // Parse the ISO date string properly
    const appointmentDate = createUTCDate(
      data.date.getFullYear(), // year
      data.date.getMonth() + 1, // month (getMonth() is zero-based)
      data.date.getDate() // day
    );
    
    const appointment = await prisma.appointment.create({
      data: {
        date: appointmentDate,
        time: data.time,
        barberId: data.barberId,
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        status: 'PENDING'
      },
      include: {
        barber: true,
        service: true
      }
    });
    
    // Send confirmation email after successful booking
    try {
      const formData = {
        date: data.date,
        timeSlot: data.time,
        barberId: data.barberId.toString(),
        serviceId: data.serviceId.toString(),
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail
      };
      
      await sendAppointmentConfirmation(
        formData,
        appointment.barber.name,
        appointment.service.name,
        appointment.service.price
      );

      await sendAppointmentConfirmationResend(
        formData,
        appointment.barber.name,
        appointment.service.name,
        appointment.service.price
      )
      
      console.log('Booking notification email sent successfully');
    } catch (emailError) {
      // Log the error but don't fail the appointment creation
      console.error('Failed to send booking notification email:', emailError);
    }
    
    revalidatePath('/appointments');
    revalidatePath('/admin/appointments');
    revalidatePath('/calendar');
    
    return { success: true, data: serializeWithService(appointment) };
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return { success: false, error: 'Failed to book appointment' };
  }
}
/**
 * Update appointment status
 */
export async function updateAppointmentStatus(
  id: number, 
  status: AppointmentStatus
) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        barber: true,
        service: true
      }
    });
    
    // Send status update email based on the new status
    try {
      if (status === 'CONFIRMED') {
        await sendAppointmentConfirmedEmail(appointment);
        await sendAppointmentConfirmedEmailResend(appointment);
        console.log('Appointment confirmation email sent successfully');
      } else if (status === 'CANCELLED') {
        await sendAppointmentCancelledEmail(appointment);
        await sendAppointmentCancelledEmailResend(appointment);
        console.log('Appointment cancellation email sent successfully');
      } else if (status === 'COMPLETED') {
        await sendAppointmentCompletedEmail(appointment);
        await sendAppointmentCompletedEmailResend(appointment);
        console.log('Appointment completion email sent successfully');
      }
    } catch (emailError) {
      // Log the error but don't fail the status update operation
      console.error(`Failed to send ${status.toLowerCase()} email:`, emailError);
    }
    
    revalidatePath('/appointments');
    revalidatePath('/admin/appointments');
    revalidatePath('/calendar');
    
    return { success: true, data: serializeWithService(appointment) };
  } catch (error) {
    console.error(`Failed to update appointment status:`, error);
    return { success: false, error: 'Failed to update appointment status' };
  }
}
/**
 * Get all appointments with optional filtering
 */
export async function getAppointments({
  status,
  barberId,
  date,
  customerId,
  page = 1,
  limit = 100
}: {
  status?: AppointmentStatus
  barberId?: number
  date?: Date
  customerId?: string
  page?: number
  limit?: number
} = {}) {
  try {
    const skip = (page - 1) * limit
    
    // Build filter conditions
    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (barberId) {
      where.barberId = barberId
    }
    
    if (date) {
      where.date = new Date(date)
    }
    
    if (customerId) {
      where.customerEmail = customerId
    }
    
    // Get appointments
    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          barber: true,
          service: true
        },
        orderBy: [
          { date: 'desc' },
          { time: 'asc' }
        ],
        skip,
        take: limit
      }),
      prisma.appointment.count({ where })
    ])
    
    return { 
      success: true, 
      data: {
        appointments: appointments.map(serializeWithService),
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page,
          limit
        }
      }
    }
  } catch (error) {
    console.error('Failed to fetch appointments:', error)
    return { success: false, error: 'Failed to load appointments' }
  }
}

/**
 * Get appointments for calendar view (day)
 */
export async function getDayAppointments(date: Date, barberId?: number) {
  try {
    const dayStart = startOfDay(new Date(date))
    const dayEnd = endOfDay(new Date(date))
    
    const where: any = {
      date: dayStart,
      status: {
        in: ['PENDING', 'CONFIRMED', 'COMPLETED']
      }
    }
    
    if (barberId) {
      where.barberId = barberId
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        barber: true,
        service: true
      },
      orderBy: {
        time: 'asc'
      }
    })
    
    return { success: true, data: appointments.map(serializeWithService) }
  } catch (error) {
    console.error('Failed to fetch day appointments:', error)
    return { success: false, error: 'Failed to load appointments' }
  }
}

/**
 * Get appointments for calendar view (week)
 */
export async function getWeekAppointments(weekStartDate: Date, barberId?: number) {
  try {
    const weekStart = startOfWeek(new Date(weekStartDate), { weekStartsOn: 0 }) // 0 = Sunday
    const weekEnd = endOfWeek(new Date(weekStartDate), { weekStartsOn: 0 })
    
    const where: any = {
      date: {
        gte: weekStart,
        lte: weekEnd
      },
      status: {
        in: ['PENDING', 'CONFIRMED', 'COMPLETED']
      }
    }
    
    if (barberId) {
      where.barberId = barberId
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        barber: true,
        service: true
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    })
    
    return { success: true, data: appointments.map(serializeWithService) }
  } catch (error) {
    console.error('Failed to fetch week appointments:', error)
    return { success: false, error: 'Failed to load appointments' }
  }
}

/**
 * Get appointments for calendar view (month)
 */
export async function getMonthAppointments(monthDate: Date, barberId?: number) {
  try {
    const monthStart = startOfMonth(new Date(monthDate))
    const monthEnd = endOfMonth(new Date(monthDate))
    
    const where: any = {
      date: {
        gte: monthStart,
        lte: monthEnd
      },
      status: {
        in: ['PENDING', 'CONFIRMED', 'COMPLETED']
      }
    }
    
    if (barberId) {
      where.barberId = barberId
    }
    
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        barber: true,
        service: true
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    })
    
    return { success: true, data: appointments.map(serializeWithService) }
  } catch (error) {
    console.error('Failed to fetch month appointments:', error)
    return { success: false, error: 'Failed to load appointments' }
  }
}

/**
 * Get appointments count by status
 */
export async function getAppointmentCounts(timeframe?: 'day' | 'week' | 'month' | 'all') {
  try {
    let dateFilter = {}
    const now = new Date()
    
    // Set date filter based on timeframe
    if (timeframe === 'day') {
      const dayStart = startOfDay(now)
      const dayEnd = endOfDay(now)
      dateFilter = {
        date: {
          gte: dayStart,
          lte: dayEnd
        }
      }
    } else if (timeframe === 'week') {
      const weekStart = startOfWeek(now, { weekStartsOn: 0 })
      const weekEnd = endOfWeek(now, { weekStartsOn: 0 })
      dateFilter = {
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    } else if (timeframe === 'month') {
      const monthStart = startOfMonth(now)
      const monthEnd = endOfMonth(now)
      dateFilter = {
        date: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    }
    
    // Get counts for each status
    const [pending, confirmed, completed, cancelled, total] = await Promise.all([
      prisma.appointment.count({
        where: {
          ...dateFilter,
          status: 'PENDING'
        }
      }),
      prisma.appointment.count({
        where: {
          ...dateFilter,
          status: 'CONFIRMED'
        }
      }),
      prisma.appointment.count({
        where: {
          ...dateFilter,
          status: 'COMPLETED'
        }
      }),
      prisma.appointment.count({
        where: {
          ...dateFilter,
          status: 'CANCELLED'
        }
      }),
      prisma.appointment.count({
        where: dateFilter
      })
    ])
    
    return { 
      success: true, 
      data: {
        pending,
        confirmed,
        completed,
        cancelled,
        total
      }
    }
  } catch (error) {
    console.error('Failed to fetch appointment counts:', error)
    return { success: false, error: 'Failed to load appointment statistics' }
  }
}

/**
 * Get appointment statistics
 */
export async function getAppointmentStats(timeframe?: 'day' | 'week' | 'month' | 'year' | 'all'): Promise<{ success: boolean, data?: AppointmentStats, error?: string }> {
  try {
    let dateFilter = {}
    const now = new Date()
    
    // Set date filter based on timeframe
    if (timeframe === 'day') {
      const dayStart = startOfDay(now)
      const dayEnd = endOfDay(now)
      dateFilter = {
        date: {
          gte: dayStart,
          lte: dayEnd
        }
      }
    } else if (timeframe === 'week') {
      const weekStart = startOfWeek(now, { weekStartsOn: 0 })
      const weekEnd = endOfWeek(now, { weekStartsOn: 0 })
      dateFilter = {
        date: {
          gte: weekStart,
          lte: weekEnd
        }
      }
    } else if (timeframe === 'month') {
      const monthStart = startOfMonth(now)
      const monthEnd = endOfMonth(now)
      dateFilter = {
        date: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    } else if (timeframe === 'year') {
      const yearStart = new Date(now.getFullYear(), 0, 1)
      const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
      dateFilter = {
        date: {
          gte: yearStart,
          lte: yearEnd
        }
      }
    }
    
    // Get counts for each status
    const [
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      completedAppointments
    ] = await Promise.all([
      prisma.appointment.count({
        where: dateFilter
      }),
      prisma.appointment.count({
        where: {
          ...dateFilter,
          status: 'PENDING'
        }
      }),
      prisma.appointment.count({
        where: {
          ...dateFilter,
          status: 'CONFIRMED'
        }
      }),
      prisma.appointment.count({
        where: {
          ...dateFilter,
          status: 'COMPLETED'
        }
      }),
      prisma.appointment.count({
        where: {
          ...dateFilter,
          status: 'CANCELLED'
        }
      }),
      prisma.appointment.findMany({
        where: {
          ...dateFilter,
          status: 'COMPLETED'
        },
        include: {
          service: {
            select: {
              price: true
            }
          }
        }
      })
    ])
    
    // Calculate rates
    const completionRate = total > 0 ? (completed / total) * 100 : 0
    const cancellationRate = total > 0 ? (cancelled / total) * 100 : 0
    
    // Calculate total revenue from completed appointments
    const totalRevenue = completedAppointments.reduce((sum, appointment) => {
      return sum + Number(appointment.service.price)
    }, 0)
    
    return { 
      success: true, 
      data: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        completionRate,
        cancellationRate,
        totalRevenue
      }
    }
  } catch (error) {
    console.error('Failed to fetch appointment statistics:', error)
    return { success: false, error: 'Failed to load appointment statistics' }
  }
}

/**
 * Get customer appointment history
 */
export async function getCustomerAppointments(customerEmail: string) {
  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        customerEmail
      },
      include: {
        barber: true,
        service: true
      },
      orderBy: [
        { date: 'desc' },
        { time: 'desc' }
      ]
    })
    
    return { success: true, data: appointments.map(serializeWithService) }
  } catch (error) {
    console.error('Failed to fetch customer appointments:', error)
    return { success: false, error: 'Failed to load appointment history' }
  }
}

/**
 * Get a specific appointment by ID
 */
export async function getAppointmentById(id: number) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        barber: true,
        service: true
      }
    })
    
    if (!appointment) {
      return { success: false, error: 'Appointment not found' }
    }
    
    return { success: true, data: serializeWithService(appointment) }
  } catch (error) {
    console.error(`Failed to fetch appointment ${id}:`, error)
    return { success: false, error: 'Failed to load appointment' }
  }
}