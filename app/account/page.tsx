"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface SearchRequest {
  _id: string
  title: string
  description: string
  location: string
  category: string
  status: string
  createdAt: string
}

export default function AccountPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchRequests, setSearchRequests] = useState<SearchRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchSearchRequests(parsedUser.id)
  }, [router])

  const fetchSearchRequests = async (userId: string) => {
    try {
      const response = await fetch(`/api/search-request?userId=${userId}`)
      const data = await response.json()
      setSearchRequests(data.requests || [])
    } catch (error) {
      console.error("Failed to fetch search requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Full Name</p>
              <p className="text-lg font-medium text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Email</p>
              <p className="text-lg font-medium text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Phone</p>
              <p className="text-lg font-medium text-gray-900">{user?.phone || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Search Requests</h2>
            <Link
              href="/search-request"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              New Request
            </Link>
          </div>

          {searchRequests.length === 0 ? (
            <p className="text-gray-600">You haven't created any search requests yet.</p>
          ) : (
            <div className="space-y-4">
              {searchRequests.map((request) => (
                <div key={request._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{request.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        request.status === "active"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "found"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{request.description}</p>
                  <div className="flex gap-4 text-sm text-gray-600">
                    <span>
                      <span className="font-medium">Location:</span> {request.location}
                    </span>
                    <span>
                      <span className="font-medium">Category:</span> {request.category}
                    </span>
                    <span>
                      <span className="font-medium">Posted:</span> {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <Link href="/dashboard" className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
