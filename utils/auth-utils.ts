'use client'
// client side cookie functions
export function isAuthenticated(): boolean {
  if (typeof document === "undefined") return false
  return document.cookie.includes("adminAuthenticated=true")
}

export function getUser(): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/adminUser=([^;]+)/)
  return match ? decodeURIComponent(match[1]) : null
}
