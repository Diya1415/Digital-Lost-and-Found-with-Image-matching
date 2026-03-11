import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Item from "@/lib/models/Item"
import Match from "@/lib/models/Match"
import { cosineSimilarity } from "@/lib/embedding"
import { calculateImageSimilarity } from "@/lib/vision"

const SIMILARITY_THRESHOLD = 0.65

export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const matches = await Match.find().populate("lostItem").populate("foundItem").sort({ createdAt: -1 })

    return NextResponse.json({ matches }, { status: 200 })
  } catch (error) {
    console.error("Match fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch matches" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()

    const lostItems = await Item.find({ itemType: "lost", matched: false })
    const foundItems = await Item.find({ itemType: "found", matched: false })

    const newMatches = []

    for (const lostItem of lostItems) {
      for (const foundItem of foundItems) {
        const textSimilarity = cosineSimilarity(lostItem.embedding, foundItem.embedding)
        const imageSimilarity = calculateImageSimilarity(lostItem.visualFeatures, foundItem.visualFeatures)

        // Weighted average: 60% text, 40% image
        const combinedSimilarity = textSimilarity * 0.6 + imageSimilarity * 0.4

        if (combinedSimilarity > SIMILARITY_THRESHOLD) {
          // Check if match already exists
          const existingMatch = await Match.findOne({
            $or: [
              { lostItem: lostItem._id, foundItem: foundItem._id },
              { lostItem: foundItem._id, foundItem: lostItem._id },
            ],
          })

          if (!existingMatch) {
            const match = await Match.create({
              lostItem: lostItem._id,
              foundItem: foundItem._id,
              similarity: combinedSimilarity,
            })

            console.log(
              `[MATCH FOUND] "${lostItem.title}" matches "${foundItem.title}" | Text: ${(textSimilarity * 100).toFixed(1)}% | Image: ${(imageSimilarity * 100).toFixed(1)}% | Combined: ${(combinedSimilarity * 100).toFixed(1)}%`,
            )

            newMatches.push(match)
          }
        }
      }
    }

    return NextResponse.json({ success: true, matchesFound: newMatches.length, matches: newMatches }, { status: 201 })
  } catch (error) {
    console.error("Match creation error:", error)
    return NextResponse.json({ error: "Failed to create matches" }, { status: 500 })
  }
}
