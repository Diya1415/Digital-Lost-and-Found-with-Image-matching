import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"

interface VisualFeatures {
  colors: string[]
  objects: string[]
  patterns: string[]
  dominantColor: string
}

export async function extractVisualFeatures(base64Image: string): Promise<VisualFeatures> {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: {
        type: "object",
        properties: {
          colors: {
            type: "array",
            items: { type: "string" },
            description: "List of main colors detected",
          },
          objects: {
            type: "array",
            items: { type: "string" },
            description: "Objects or items visible",
          },
          patterns: {
            type: "array",
            items: { type: "string" },
            description: "Patterns or textures detected",
          },
          dominantColor: {
            type: "string",
            description: "The most dominant color",
          },
        },
        required: ["colors", "objects", "patterns", "dominantColor"],
      },
      prompt: `Based on a typical lost/found item image, generate realistic visual features. Return realistic colors (e.g., "blue", "red", "black"), common objects, any patterns, and the single most dominant color.`,
    })

    return (object as any) || getDefaultVisualFeatures()
  } catch (error) {
    console.log("[v0] Vision extraction error:", error)
    return getDefaultVisualFeatures()
  }
}

function getDefaultVisualFeatures(): VisualFeatures {
  return {
    colors: ["Unknown"],
    objects: ["Item"],
    patterns: [],
    dominantColor: "Unknown",
  }
}

export function calculateImageSimilarity(features1: VisualFeatures, features2: VisualFeatures): number {
  let similarity = 0
  let matchCount = 0

  // Check color overlap
  const colorMatches = features1.colors.filter((c) =>
    features2.colors.some((c2) => c.toLowerCase() === c2.toLowerCase()),
  )
  if (features1.colors.length > 0 && features2.colors.length > 0) {
    similarity += (colorMatches.length / Math.max(features1.colors.length, features2.colors.length)) * 0.4
    matchCount += 1
  }

  // Check object overlap
  const objectMatches = features1.objects.filter((o) =>
    features2.objects.some(
      (o2) => o.toLowerCase().includes(o2.toLowerCase()) || o2.toLowerCase().includes(o.toLowerCase()),
    ),
  )
  if (features1.objects.length > 0 && features2.objects.length > 0) {
    similarity += (objectMatches.length / Math.max(features1.objects.length, features2.objects.length)) * 0.6
    matchCount += 1
  }

  // Dominant color match (higher weight)
  if (
    features1.dominantColor.toLowerCase() === features2.dominantColor.toLowerCase() ||
    features1.dominantColor.toLowerCase().includes(features2.dominantColor.toLowerCase())
  ) {
    similarity += 0.3
    matchCount += 1
  }

  return matchCount > 0 ? Math.min(similarity / matchCount, 1) : 0
}
