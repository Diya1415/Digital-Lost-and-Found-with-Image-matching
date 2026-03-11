import { type NextRequest, NextResponse } from "next/server"
import { InMemoryDB } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Signup API called")

    const { email, password, name, phone } = await request.json()
    console.log("[v0] Signup data received:", { email, name, phone })

    // Validate inputs
    if (!email || !password || !name) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    console.log("[v0] Checking if user exists...")
    const existingUser = await InMemoryDB.findUserByEmail(email)
    if (existingUser) {
      console.log("[v0] User already exists")
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    // Create new user
    console.log("[v0] Creating new user...")
    const newUser = await InMemoryDB.createUser({
      email,
      password,
      name,
      phone,
    })
    console.log("[v0] User created successfully:", newUser._id)

    const response = NextResponse.json(
      {
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
        },
      },
      { status: 201 },
    )

    response.cookies.set(
      "user",
      JSON.stringify({
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      }),
      {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
      },
    )

    console.log("[v0] Signup response sent successfully")
    return response
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup. Please try again." }, { status: 500 })
  }
}
