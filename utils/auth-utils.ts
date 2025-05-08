// Simple client-side authentication utilities
// In a real app, you would use a proper auth system like NextAuth.js
/*
export async function signIn(email: string, password: string): Promise<boolean> {
  // call validating function to check login credentials
  const isValid = await validate(email, password)

  if (isValid) {
    sessionStorage.setItem("adminAuthenticated", "true")
    sessionStorage.setItem("adminUser", email)
  }

  return isValid
}
*/

export function signOut(): void {
  sessionStorage.removeItem("adminAuthenticated")
  sessionStorage.removeItem("adminUser")
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false
  return sessionStorage.getItem("adminAuthenticated") === "true"
}

export function getUser(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem("adminUser")
}

/*
async function validate(email: string, password: string): Promise<boolean> {
  // sends request to server
  const res = await fetch('/admin/sign-in/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) return false

  const data = await res.json()
  return data.valid === true
}*/