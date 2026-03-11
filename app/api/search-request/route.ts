import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import SearchRequest from "@/lib/models/SearchRequest"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    const searchRequest = new SearchRequest({
      title: body.title,
      description: body.description,
      category: body.category,
      itemType: body.itemType,
      location: body.location,
      color: body.color,
      userId: body.userId,
      userName: body.userName,
      userEmail: body.userEmail,
      userPhone: body.userPhone,
    })

    await searchRequest.save()

    return NextResponse.json({ message: "Search request created", request: searchRequest }, { status: 201 })
  } catch (error) {
    console.error("Error creating search request:", error)
    return NextResponse.json({ error: "Failed to create search request" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 })
    }

    const requests = await SearchRequest.find({ userId }).sort({ createdAt: -1 })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error("Error fetching search requests:", error)
    return NextResponse.json({ error: "Failed to fetch search requests" }, { status: 500 })
  }
}
