"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface VisualFeatures {
  colors: string[]
  objects: string[]
  patterns: string[]
  dominantColor: string
}

interface ItemWithVisuals {
  _id: string
  title: string
  description: string
  location: string
  image: string
  category: string
  itemType: string
  visualFeatures: VisualFeatures
  userName: string
  userEmail: string
}

interface ImageMatch {
  lostItem: ItemWithVisuals
  foundItem: ItemWithVisuals
  similarity: number
  _id: string
  textSimilarity?: number
  imageSimilarity?: number
}

export default function ImageMatchPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<ImageMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
    fetchMatches()
  }, [router])

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/match")
      const data = await response.json()
      setMatches(data.matches || [])
    } catch (error) {
      console.error("Error fetching matches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRunMatching = async () => {
    try {
      setLoading(true)
      await fetch("/api/match", { method: "POST" })
      await fetchMatches()
    } catch (error) {
      console.error("Error running matching:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              AI Image Matching
            </h1>
            <p className="text-gray-600 mt-2">Visual similarity analysis with AI-powered detection</p>
          </div>
          <button
            onClick={handleRunMatching}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition disabled:opacity-50 font-semibold"
          >
            {loading ? "Processing..." : "Run Matching"}
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="mb-4 text-5xl">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Image Matches Found</h3>
            <p className="text-gray-600 mb-6">
              Upload items and run the matching algorithm to find visual similarities.
            </p>
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upload Item
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => (
              <div
                key={match._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                  {/* Lost Item */}
                  <div>
                    <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      LOST ITEM
                    </span>
                    <img
                      src={match.lostItem.image || "/placeholder.svg"}
                      alt={match.lostItem.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{match.lostItem.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{match.lostItem.description}</p>

                    {/* Visual Features */}
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-700 font-medium">Colors:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {match.lostItem.visualFeatures?.colors?.map((color) => (
                            <span key={color} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {color}
                            </span>
                          )) || <span className="text-gray-500">N/A</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Objects:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {match.lostItem.visualFeatures?.objects?.map((obj) => (
                            <span key={obj} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {obj}
                            </span>
                          )) || <span className="text-gray-500">N/A</span>}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">By: {match.lostItem.userName}</p>
                  </div>

                  {/* Match Score */}
                  <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg py-8">
                    <div className="text-center">
                      <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        {(match.similarity * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600 font-medium mb-4">Match Score</p>

                      {/* Score Breakdown */}
                      <div className="space-y-2 text-xs text-gray-600">
                        <p>Combining text & visual analysis</p>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600"
                            style={{ width: `${match.similarity * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Found Item */}
                  <div>
                    <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      FOUND ITEM
                    </span>
                    <img
                      src={match.foundItem.image || "/placeholder.svg"}
                      alt={match.foundItem.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{match.foundItem.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{match.foundItem.description}</p>

                    {/* Visual Features */}
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-gray-700 font-medium">Colors:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {match.foundItem.visualFeatures?.colors?.map((color) => (
                            <span key={color} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {color}
                            </span>
                          )) || <span className="text-gray-500">N/A</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Objects:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {match.foundItem.visualFeatures?.objects?.map((obj) => (
                            <span key={obj} className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                              {obj}
                            </span>
                          )) || <span className="text-gray-500">N/A</span>}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">By: {match.foundItem.userName}</p>
                  </div>
                </div>

                {/* Contact Action */}
                <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex gap-3 justify-end">
                  <a
                    href={`mailto:${match.lostItem.userEmail}`}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                  >
                    Contact Lost Item Owner
                  </a>
                  <a
                    href={`mailto:${match.foundItem.userEmail}`}
                    className="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                  >
                    Contact Found Item Finder
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
