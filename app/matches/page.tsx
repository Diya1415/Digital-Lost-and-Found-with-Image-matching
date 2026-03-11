"use client"

import { useEffect, useState } from "react"

interface MatchItem {
  lostItem: any
  foundItem: any
  similarity: number
  _id: string
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
    const interval = setInterval(fetchMatches, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchMatches = async () => {
    try {
      const response = await fetch("/api/match")
      const data = await response.json()
      setMatches(data.matches)
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

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI-Powered Matches</h1>
          <button
            onClick={handleRunMatching}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Run Matching"}
          </button>
        </div>

        {matches.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No matches found yet.</p>
            <p className="text-gray-600">Upload some items and click "Run Matching" to find potential matches!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div key={match._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-semibold text-red-600 mb-2">Lost Item</h3>
                    <p className="font-bold text-lg mb-2">{match.lostItem.title}</p>
                    <p className="text-gray-600 text-sm">{match.lostItem.description}</p>
                    <p className="text-gray-500 text-xs mt-2">Location: {match.lostItem.location}</p>
                  </div>

                  <div className="flex flex-col justify-center items-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {(match.similarity * 100).toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">Match Score</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-green-600 mb-2">Found Item</h3>
                    <p className="font-bold text-lg mb-2">{match.foundItem.title}</p>
                    <p className="text-gray-600 text-sm">{match.foundItem.description}</p>
                    <p className="text-gray-500 text-xs mt-2">Location: {match.foundItem.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
