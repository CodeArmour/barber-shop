"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { SignInForm } from "@/components/admin/sign-in-form"
import { DecorativeElements } from "@/components/admin/decorative-elements"
import { isAuthenticated } from "@/utils/auth-utils"
import { AnimatedNav } from "@/components/admin/animated-nav"

export function SignInSection() {
  const router = useRouter()

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/admin")
    }
  }, [router])

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <AnimatedNav />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>

      <DecorativeElements />
    </div>
  )
}
