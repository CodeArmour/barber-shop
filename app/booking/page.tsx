"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { BookingSection } from "@/sections/booking/booking-section"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main>
        <BookingSection />
      </main>
      <Footer />
    </div>
  )
}
