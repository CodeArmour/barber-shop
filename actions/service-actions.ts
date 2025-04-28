'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// Create a serialization function to convert Decimal to string
const serializeService = (service: any) => ({
  ...service,
  price: service.price ? service.price.toString() : null,
  createdAt: service.createdAt ? service.createdAt.toISOString() : null,
  updatedAt: service.updatedAt ? service.updatedAt.toISOString() : null,
})

/**
 * Get all active services
 */
export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    // Serialize the services to handle Decimal type
    const serializedServices = services.map(serializeService)
    
    return { success: true, data: serializedServices }
  } catch (error) {
    console.error('Failed to fetch services:', error)
    return { success: false, error: 'Failed to load services' }
  }
}

/**
 * Get a specific service by ID
 */
export async function getServiceById(id: number) {
  try {
    const service = await prisma.service.findUnique({
      where: { id }
    })
    
    if (!service) {
      return { success: false, error: 'Service not found' }
    }
    
    // Serialize the service to handle Decimal type
    const serializedService = serializeService(service)
    
    return { success: true, data: serializedService }
  } catch (error) {
    console.error(`Failed to fetch service ${id}:`, error)
    return { success: false, error: 'Failed to load service' }
  }
}

/**
 * Create a new service
 */
export async function createService(serviceData: {
  name: string
  description?: string
  duration: number
  price: number
  imageUrl?: string
}) {
  try {
    const service = await prisma.service.create({
      data: {
        ...serviceData,
        price: typeof serviceData.price === 'number' 
          ? serviceData.price 
          : parseFloat(serviceData.price as unknown as string)
      }
    })
    
    revalidatePath('/admin/services')
    return { success: true, data: serializeService(service) }
  } catch (error) {
    console.error('Failed to create service:', error)
    return { success: false, error: 'Failed to create service' }
  }
}

/**
 * Update an existing service
 */
export async function updateService(
  id: number,
  serviceData: {
    name?: string
    description?: string
    duration?: number
    price?: number
    imageUrl?: string
    isActive?: boolean
  }
) {
  try {
    // Handle price conversion if needed
    if (serviceData.price !== undefined && typeof serviceData.price !== 'number') {
      serviceData.price = parseFloat(serviceData.price as unknown as string)
    }
    
    const service = await prisma.service.update({
      where: { id },
      data: serviceData
    })
    
    revalidatePath('/admin/services')
    return { success: true, data: serializeService(service) }
  } catch (error) {
    console.error(`Failed to update service ${id}:`, error)
    return { success: false, error: 'Failed to update service' }
  }
}

/**
 * Delete a service (soft delete by setting isActive to false)
 */
export async function deleteService(id: number) {
  try {
    await prisma.service.update({
      where: { id },
      data: { isActive: false }
    })
    
    revalidatePath('/admin/services')
    return { success: true }
  } catch (error) {
    console.error(`Failed to delete service ${id}:`, error)
    return { success: false, error: 'Failed to delete service' }
  }
}