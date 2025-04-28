'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

/**
 * Get all active barbers
 */
export async function getBarbers() {
  try {
    const barbers = await prisma.barber.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return { success: true, data: barbers }
  } catch (error) {
    console.error('Failed to fetch barbers:', error)
    return { success: false, error: 'Failed to load barbers' }
  }
}

/**
 * Get a specific barber by ID
 */
export async function getBarberById(id: number) {
  try {
    const barber = await prisma.barber.findUnique({
      where: { id }
    })
    
    if (!barber) {
      return { success: false, error: 'Barber not found' }
    }
    
    return { success: true, data: barber }
  } catch (error) {
    console.error(`Failed to fetch barber ${id}:`, error)
    return { success: false, error: 'Failed to load barber' }
  }
}

/**
 * Get barber availability for a specific day
 */
export async function getBarberAvailability(barberId: number, date: Date) {
  try {
    // Format date to YYYY-MM-DD for comparison
    const formattedDate = new Date(date)
    formattedDate.setHours(0, 0, 0, 0)
    
    // Get all appointments for this barber on this day
    const appointments = await prisma.appointment.findMany({
      where: {
        barberId: barberId,
        date: formattedDate,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        time: true,
        service: {
          select: {
            duration: true
          }
        }
      }
    })
    
    return { 
      success: true, 
      data: {
        appointments,
        date: formattedDate
      }
    }
  } catch (error) {
    console.error(`Failed to fetch barber availability:`, error)
    return { success: false, error: 'Failed to load availability' }
  }
}

/**
 * Create a new barber
 */
export async function createBarber(barberData: {
  name: string
  email: string
  phone?: string
  bio?: string
  imageUrl?: string
}) {
  try {
    const barber = await prisma.barber.create({
      data: barberData
    })
    
    revalidatePath('/admin/barbers')
    return { success: true, data: barber }
  } catch (error) {
    console.error('Failed to create barber:', error)
    return { success: false, error: 'Failed to create barber' }
  }
}

/**
 * Update an existing barber
 */
export async function updateBarber(
  id: number,
  barberData: {
    name?: string
    email?: string
    phone?: string
    bio?: string
    imageUrl?: string
    isActive?: boolean
  }
) {
  try {
    const barber = await prisma.barber.update({
      where: { id },
      data: barberData
    })
    
    revalidatePath('/admin/barbers')
    return { success: true, data: barber }
  } catch (error) {
    console.error(`Failed to update barber ${id}:`, error)
    return { success: false, error: 'Failed to update barber' }
  }
}

/**
 * Delete a barber (soft delete by setting isActive to false)
 */
export async function deleteBarber(id: number) {
  try {
    await prisma.barber.update({
      where: { id },
      data: { isActive: false }
    })
    
    revalidatePath('/admin/barbers')
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete barber ${id}:`, error)
    return { success: false, error: 'Failed to delete barber' }
  }
}