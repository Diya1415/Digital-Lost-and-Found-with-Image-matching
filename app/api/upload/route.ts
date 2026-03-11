import { type NextRequest, NextResponse } from "next/server"
import InMemoryDB from "@/lib/mongodb"
import { generateEmbedding, categorizeItem } from "@/lib/embedding"
import { extractVisualFeatures } from "@/lib/vision"

export async function POST(req: NextRequest) {
  try {
    console.log("[v0] Starting upload...")

    const formData = await req.formData()
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const itemType = formData.get("itemType") as string
    const location = formData.get("location") as string
    const image = formData.get("image") as string
    const userId = formData.get("userId") as string
    const userName = formData.get("userName") as string
    const userEmail = formData.get("userEmail") as string
    const userPhone = formData.get("userPhone") as string

    if (!title || !description || !itemType || !location || !image || !userId) {
      console.log("[v0] Missing fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Categorizing item...")
    const category = await categorizeItem(description)
    console.log("[v0] Category:", category)

    console.log("[v0] Generating embedding...")
    const embedding = await generateEmbedding(`${title} ${description}`)
    console.log("[v0] Embedding generated")

    console.log("[v0] Extracting visual features...")
    const visualFeatures = await extractVisualFeatures(image)
    console.log("[v0] Visual features extracted")

    console.log("[v0] Creating item in database...")
    const newItem = await InMemoryDB.createItem({
      title,
      description,
      category,
      itemType,
      location,
      image,
      embedding,
      visualFeatures,
      userId,
      userName: userName || "Anonymous",
      userEmail: userEmail || "unknown@email.com",
      userPhone,
      _id: "",
      uploadedAt: new Date(),
    })

    console.log("[v0] Item created successfully:", newItem._id)
    return NextResponse.json({ success: true, item: newItem }, { status: 201 })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to upload item"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
