"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, User, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { signIn } from "@/utils/auth-utils"

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password")
      setIsLoading(false)
      return
    }

    try {
      const success = await signIn(formData.email, formData.password)

      if (success) {
        router.push("/admin")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error("Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="space-y-1 text-center bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-t-lg">
        <div className="flex justify-center mb-2">
          <div className="bg-white/20 p-3 rounded-full">
            <Lock className="h-6 w-6" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
        <CardDescription className="text-amber-100">
          Enter your credentials to access the admin dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input
                  id="email"
                  name="email"
                  placeholder="admin@sharpcuts.com"
                  type="email"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-amber-700 hover:text-amber-800">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <Input
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  type="password"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <Separator />
      <CardFooter className="flex flex-col space-y-4 pt-4">
        <div className="text-sm text-center text-stone-500">
          <p>Demo credentials:</p>
          <p className="font-mono bg-stone-100 px-2 py-1 rounded text-xs mt-1">admin@sharpcuts.com / admin123</p>
        </div>
      </CardFooter>
    </Card>
  )
}
