"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Scissors, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"

interface ErrorPageProps {
  code?: string | number
  title: string
  description: string
  showBarberPole?: boolean
}

export function ErrorPage({
  code = "404",
  title = "Looks Like We Missed a Spot",
  description = "The page you're looking for has been trimmed from our style book or never existed.",
  showBarberPole = true,
}: ErrorPageProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  // Trigger scissors animation periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }, 5000)

    // Initial animation
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Barber pole decoration */}
      {showBarberPole && (
        <div className="absolute top-0 left-0 h-full w-4 md:w-8 bg-gradient-to-b from-red-500 via-white to-blue-500 bg-[length:100%_50px] animate-barber-pole" />
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-stone-800 opacity-10">{code}</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Scissors
              className={`h-20 w-20 text-amber-600 transition-all duration-500 ${
                isAnimating ? "animate-scissors-cut" : "transform rotate-45"
              }`}
            />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-stone-800 mb-4">{title}</h1>

        <p className="text-xl text-stone-600 max-w-md mb-8">{description}</p>

        <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex">
          <AnimatedButton asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </AnimatedButton>

          <Button variant="outline" asChild>
            <Link href="/booking">
              <Scissors className="mr-2 h-4 w-4" />
              Book Appointment
            </Link>
          </Button>
        </div>
      </main>

      {/* Decorative elements */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <Scissors className="h-64 w-64 text-stone-800 transform rotate-12" />
      </div>

      <div className="absolute top-1/4 right-1/4 opacity-5 pointer-events-none hidden md:block">
        <Scissors className="h-32 w-32 text-stone-800 transform -rotate-12" />
      </div>
    </div>
  )
}
