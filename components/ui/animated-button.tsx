"use client"

import type React from "react"

import { useState, forwardRef } from "react"
import { Scissors } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  iconPosition?: "left" | "right"
  asChild?: boolean
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, className, variant, size, iconPosition = "right", asChild = false, ...props }, ref) => {
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn("group", className)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false)
          setIsClicking(false)
        }}
        onMouseDown={() => setIsClicking(true)}
        onMouseUp={() => setIsClicking(false)}
        asChild={asChild}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {iconPosition === "left" && (
              <Scissors
                className={`h-4 w-4 mr-2 transition-all duration-300 ${
                  isClicking ? "animate-scissors-cut-fast" : isHovering ? "animate-scissors-hover" : ""
                }`}
              />
            )}
            <span>{children}</span>
            {iconPosition === "right" && (
              <Scissors
                className={`h-4 w-4 ml-2 transition-all duration-300 ${
                  isClicking ? "animate-scissors-cut-fast" : isHovering ? "animate-scissors-hover" : ""
                }`}
              />
            )}
          </>
        )}
      </Button>
    )
  },
)

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton }
