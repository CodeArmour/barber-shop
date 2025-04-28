// Simple client-side authentication utilities
// In a real app, you would use a proper auth system like NextAuth.js

export function signIn(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        // For demo purposes only - in a real app, this would be a server-side check
        const isValid = email === "admin@sharpcuts.com" && password === "admin123"
  
        if (isValid) {
          // Store authentication state
          sessionStorage.setItem("adminAuthenticated", "true")
          sessionStorage.setItem("adminUser", email)
        }
  
        resolve(isValid)
      }, 800)
    })
  }
  
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
  