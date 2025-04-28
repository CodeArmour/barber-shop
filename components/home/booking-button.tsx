"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BookingButton() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()

    if (isAnimating) return

    setIsAnimating(true)

    // Add a flash effect to the button
    if (buttonRef.current) {
      buttonRef.current.classList.add("animate-pulse")
    }

    // Wait for animation to complete before navigating
    setTimeout(() => {
      router.push("/booking")
    }, 1000) // Animation takes 1.2s, but we can start transition a bit earlier
  }

  return (
    <Button
      ref={buttonRef}
      size="lg"
      className="book-button relative overflow-hidden group"
      onClick={handleClick}
      disabled={isAnimating}
    >
      <span className={`relative z-10 transition-opacity duration-300 ${isAnimating ? "opacity-70" : "opacity-100"}`}>
        Book Now
      </span>

      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <Scissors className="h-8 w-8 text-white animate-scissors-slide" />
        </div>
      )}
    </Button>
  )
}
