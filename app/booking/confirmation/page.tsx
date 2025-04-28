"use client"

import Link from "next/link"
import { CheckCircle, Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export default function ConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
          <p className="text-lg text-stone-600 mb-8">
            Your appointment has been successfully booked. We've sent a confirmation email with all the details.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
