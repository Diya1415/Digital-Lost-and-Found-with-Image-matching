import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"

interface TextEmbedding {
  embedding: number[]
}

export async function generateEmbedding(text: string): Promise<number[]> {
  // Create a simple deterministic embedding based on text hash + AI categorization
  // Using openai models through AI SDK
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: {
        type: "object",
        properties: {
          vector: {
            type: "array",
            items: { type: "number" },
            description: "A 10-dimensional embedding vector",
          },
        },
        required: ["vector"],
      },
      prompt: `Generate a 10-dimensional embedding vector for: "${text}". Return an array of 10 numbers between -1 and 1.`,
    })

    const vector = (object as any).vector
    if (Array.isArray(vector) && vector.length === 10) {
      return vector
    }
    return generateFallbackEmbedding(text)
  } catch (error) {
    console.log("[v0] Embedding error:", error)
    return generateFallbackEmbedding(text)
  }
}

function generateFallbackEmbedding(text: string): number[] {
  // Fallback: simple hash-based embedding
  const hash = text.split("").reduce((h, c) => (h << 5) - h + c.charCodeAt(0), 0)
  return Array(10)
    .fill(0)
    .map((_, i) => Math.sin(hash + i) * 0.5)
}

export async function categorizeItem(description: string): Promise<string> {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: {
        type: "object",
        properties: {
          category: {
            type: "string",
            enum: ["Electronics", "Clothing", "Accessories", "Documents", "Keys", "Bags", "Other"],
            description: "Category of the item",
          },
        },
      },
      prompt: `Categorize this item based on its description: "${description}". Choose the most appropriate category.`,
    })

    return (object as any).category || "Other"
  } catch (error) {
    console.error("Error categorizing item:", error)
    return "Other"
  }
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0))

  if (magnitudeA === 0 || magnitudeB === 0) return 0
  return dotProduct / (magnitudeA * magnitudeB)
}
