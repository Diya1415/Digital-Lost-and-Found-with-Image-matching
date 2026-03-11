// Authentication utilities for user session management
import { cookies } from "next/headers"

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie?.value) return null

    const user = JSON.parse(userCookie.value)
    return user
  } catch {
    return null
  }
}

export async function setUserCookie(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearUserCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
}
