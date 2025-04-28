"use client"

import { CalendarIcon, Clock, Scissors, User } from "lucide-react"
import { format } from "date-fns"
import { useFormContext, useWatch } from "react-hook-form"
import { use, useEffect, useState } from "react"
import { getBarbers } from '@/actions/barber-actions'
import { getServices } from '@/actions/service-actions'
import type { Barber } from "@/types/barber"
import type { Service } from "@/types/service"


export function BookingSummary() {
  const { control } = useFormContext()

  // Use useWatch to reactively watch form values
  const date = useWatch({ control, name: "date" })
  const timeSlot = useWatch({ control, name: "timeSlot" })
  const barber = useWatch({ control, name: "barberId" })
  const service = useWatch({ control, name: "serviceId" })
  
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Call both actions to get barbers and services
        const [barbersResult, servicesResult] = await Promise.all([
          getBarbers(),
          getServices()
        ])

        if (barbersResult.success && barbersResult.data) {
          setBarbers(barbersResult.data)
        }
        
        if (servicesResult.success && servicesResult.data) {
          setServices(servicesResult.data)
        }

        console.log("Barbers:", barbersResult.data)
        console.log("Services:", servicesResult.data)
        
      } catch (error) {
        console.error("Error fetching form data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const selectedService = service ? services.find((s) => s.id === Number(service)) : null
  const selectedBarber = barber ? barbers.find((b) => b.id === Number(barber)) : null

  return (
    <div className="space-y-4">
      {date && (
        <div className="flex items-start gap-2">
          <CalendarIcon className="h-5 w-5 text-stone-500 mt-0.5" />
          <div>
            <p className="font-medium">Date</p>
            <p className="text-stone-600">{format(date, "MMMM d, yyyy")}</p>
          </div>
        </div>
      )}

      {timeSlot && (
        <div className="flex items-start gap-2">
          <Clock className="h-5 w-5 text-stone-500 mt-0.5" />
          <div>
            <p className="font-medium">Time</p>
            <p className="text-stone-600">{timeSlot}</p>
          </div>
        </div>
      )}

      {selectedBarber && (
        <div className="flex items-start gap-2">
          <User className="h-5 w-5 text-stone-500 mt-0.5" />
          <div>
            <p className="font-medium">Barber</p>
            <p className="text-stone-600">{selectedBarber.name}</p>
          </div>
        </div>
      )}

      {selectedService && (
        <div className="flex items-start gap-2">
          <Scissors className="h-5 w-5 text-stone-500 mt-0.5" />
          <div>
            <p className="font-medium">Service</p>
            <p className="text-stone-600">{selectedService.name}</p>
            <p className="text-stone-600">${selectedService.price}</p>
            <p className="text-stone-600 text-sm">{selectedService.duration} minutes</p>
          </div>
        </div>
      )}
    </div>
  )
}
