"use client";

import { useForm, FormProvider } from "react-hook-form";

import { BookingForm } from "@/components/booking/booking-form";
import { BookingPolicy } from "@/components/booking/booking-policy";
import { BookingSummary } from "@/components/booking/booking-summary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookingFormData } from "@/types/Booking";

export function BookingSection() {
  // Initialize form with react-hook-form
  const methods = useForm<BookingFormData>({
    defaultValues: {
      date: undefined,
      timeSlot: "",
      name: "",
      phone: "",
      email: "",
    },
  });

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
        Book Your Appointment
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
        <FormProvider {...methods}>
          <Card className="col-span-1 lg:col-span-2 shadow-sm">
            <CardHeader className="pb-4 md:pb-6">
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Fill in the details to book your appointment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm />
            </CardContent>
          </Card>

          {/* Summary card - hidden on mobile, shown at bottom */}
          <div className="hidden lg:block">
            <Card className="shadow-sm sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle>Appointment Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingSummary />
              </CardContent>
            </Card>

            <div className="mt-6 sticky top-[350px]">
              <BookingPolicy />
            </div>
          </div>

          {/* Mobile summary - only shown on small screens */}
          <Card className="col-span-1 lg:hidden shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle>Appointment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <BookingSummary />
              <div className="mt-4">
                <BookingPolicy />
              </div>
            </CardContent>
          </Card>
        </FormProvider>
      </div>
    </div>
  );
}
