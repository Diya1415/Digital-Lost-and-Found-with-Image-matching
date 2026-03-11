import { type NextRequest, NextResponse } from "next/server"
import InMemoryDB from "@/lib/mongodb"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const type = searchParams.get("type")
    const category = searchParams.get("category")

    const query: any = {}
    if (type) query.itemType = type
    if (category) query.category = category

    const items = await InMemoryDB.findItems(query)

    return NextResponse.json({ items }, { status: 200 })
  } catch (error) {
    console.error("Items fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 })
  }
}
