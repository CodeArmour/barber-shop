'use server'
// server side cookie functions
import { cookies } from "next/headers"

export async function signOut(): Promise<void> {
  // Await the cookies promise
  const cookie = await cookies()
  cookie.delete("adminAuthenticated")
  cookie.delete("adminUser")
}
