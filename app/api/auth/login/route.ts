import { type NextRequest, NextResponse } from "next/server"
import { InMemoryDB } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }
    const user = await InMemoryDB.findUserByEmail(email)
    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          phone: user.phone,
        },
      },
      { status: 200 },
    )

    response.cookies.set(
      "user",
      JSON.stringify({
        id: user._id,
        email: user.email,
        name: user.name,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    )

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "An error occurred during login. Please try again." }, { status: 500 })
  }
}
