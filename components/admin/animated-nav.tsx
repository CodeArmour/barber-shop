"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Scissors } from "lucide-react"

export function AnimatedNav() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)

    // Wait for animation to complete before navigating
    setTimeout(() => {
      router.push("/")
    }, 600) // Animation takes 500ms, add a little buffer
  }

  return (
    <div className="fixed top-6 left-6 z-10">
      <button
        onClick={handleClick}
        className="group bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        aria-label="Return to home page"
        disabled={isAnimating}
      >
        <Scissors
          className={`h-6 w-6 transition-transform duration-500 ${
            isAnimating ? "animate-scissors" : "group-hover:rotate-45"
          }`}
        />
      </button>
    </div>
  )
}
