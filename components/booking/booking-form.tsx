"use client";

import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getBarbers } from "@/actions/barber-actions";
import { getServices } from "@/actions/service-actions";
import { createAppointment } from "@/actions/appointment-actions";
import type { Barber } from "@/types/barber";
import type { Service } from "@/types/service";
import type { BookingFormData } from "@/types/Booking";
import { showSuccessToast, showErrorToast } from "@/utils/toast-utils"
import { AnimatedButton } from "@/components/ui/animated-button"

import { formatISODate, formatDisplayDate } from "@/utils/date-helper";

// Available time slots
const timeSlots = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
];

export function BookingForm() {
  const router = useRouter();
 
  const form = useFormContext<BookingFormData>();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setIsSubmitting(true)
      try {
        // Call both actions to get barbers and services
        const [barbersResult, servicesResult] = await Promise.all([
          getBarbers(),
          getServices(),
        ]);

        if (barbersResult.success && barbersResult.data) {
          setBarbers(barbersResult.data);
        }

        if (servicesResult.success && servicesResult.data) {
          setServices(servicesResult.data);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setLoading(false);
        setIsSubmitting(false)
      }
    }

    fetchData();
  }, []);

  const onSubmit = async (data: BookingFormData) => {
    if (
      !data.date ||
      !data.timeSlot ||
      !data.barberId ||
      !data.serviceId ||
      !data.name ||
      !data.phone ||
      !data.email
    ) {
      showErrorToast("Form Validation Error", "Please fill in all required fields to complete your booking.")
      return;
    }
    setLoading(true);
    setIsSubmitting(true)
    try {
      // Use the helper function to ensure correct date handling
      const appointmentPayload = {
        date: new Date(data.date), // Convert the date string to a Date object
        time: data.timeSlot,
        barberId: parseInt(data.barberId),
        serviceId: parseInt(data.serviceId),
        customerName: data.name,
        customerPhone: data.phone,
        customerEmail: data.email,
      };

      const result = await createAppointment(appointmentPayload);
  
      if (result.success) {
        showSuccessToast("Appointment Booked",`Your appointment has been scheduled for ${formatDisplayDate(
            data.date
          )} at ${data.timeSlot}`);
  
        router.push("/booking/confirmation");
        
      } else {
        showErrorToast("Booking Error", result.error || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      showErrorToast("Booking Error", "An unexpected error occurred while booking your appointment.");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {/* Date Field */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? format(field.value, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      date.getDay() === 0
                    } // Disable Sundays
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeSlot"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper" className="max-h-[300px]">
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barberId" // Changed from "barber" to "barberId" to match action parameter
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barber</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={loading}>
                    <SelectValue placeholder="Select barber" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  {barbers.map((barber) => (
                    <SelectItem key={barber.id} value={barber.id.toString()}>
                      {barber.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceId" // Changed from "service" to "serviceId" to match action parameter
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger disabled={loading}>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id.toString()}>
                      {service.name} (${service.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="(555) 123-4567" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john@example.com" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <AnimatedButton
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Booking..." : "Book Appointment"}
      </AnimatedButton>
    </form>
  );
}
