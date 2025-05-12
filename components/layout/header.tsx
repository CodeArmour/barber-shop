"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, Scissors, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getUser } from "@/utils/auth-utils"
import { signOut } from "@/utils/auth-server-utils"

type HeaderProps = {
  isAdmin?: boolean
}

export function Header({ isAdmin = false }: HeaderProps) {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [adminUser, setAdminUser] = useState<string | null>(null)

  useEffect(() => {
    if (isAdmin) {
      setAdminUser(getUser())
    }
  }, [isAdmin])

  const handleSignOut = () => {
    signOut()
    router.push("/admin/sign-in")
  }

  return (
    <header className="header">
      <div className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-xl font-bold">Sharp Cuts</h1>
          </Link>

          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col gap-6 mt-8">
                  {isAdmin ? (
                    <>
                      {adminUser && (
                        <div className="text-sm text-stone-500 mb-2">
                          Signed in as: <span className="font-medium">{adminUser}</span>
                        </div>
                      )}
                      <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Home
                      </Link>
                      <Link
                        href="/booking"
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Booking Page
                      </Link>
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false)
                          handleSignOut()
                        }}
                        className="flex items-center gap-2 text-lg font-medium text-red-600"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/booking"
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Book Appointment
                      </Link>
                      <Link
                        href="/admin/sign-in"
                        className="flex items-center gap-2 text-lg font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {isAdmin ? (
              <>
                {adminUser && (
                  <span className="text-sm text-stone-300 mr-2">
                    Signed in as: <span className="font-medium">{adminUser}</span>
                  </span>
                )}
                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-stone-800"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-stone-800" asChild>
                  <Link href="/">Exit Admin</Link>
                </Button>
              </>
            ) : (
              <Link href="/admin/sign-in">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-stone-800">
                  Admin Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
