"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Item {
  _id: string
  title: string
  description: string
  location: string
  color?: string
  category: string
  itemType: string
  image: string
  uploadedAt: string
  userName: string
  userEmail: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [filteredItems, setFilteredItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  const [filters, setFilters] = useState({
    location: "",
    category: "",
    color: "",
    itemType: "all",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(userData))
    fetchItems()
  }, [router])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/items")
      const data = await response.json()
      setItems(data.items || [])
      setFilteredItems(data.items || [])
    } catch (error) {
      console.error("Failed to fetch items:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = items

    if (filters.itemType !== "all") {
      filtered = filtered.filter((item) => item.itemType === filters.itemType)
    }

    if (filters.location) {
      filtered = filtered.filter((item) => item.location.toLowerCase().includes(filters.location.toLowerCase()))
    }

    if (filters.category) {
      filtered = filtered.filter((item) => item.category.toLowerCase().includes(filters.category.toLowerCase()))
    }

    if (filters.color) {
      filtered = filtered.filter((item) => item.color?.toLowerCase().includes(filters.color.toLowerCase()))
    }

    setFilteredItems(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, items])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            {user && <p className="text-gray-600 mt-2">Welcome, {user.name}</p>}
          </div>
          <div className="flex gap-4">
            <Link
              href="/account"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              My Account
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Filter Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
              <select
                value={filters.itemType}
                onChange={(e) => setFilters({ ...filters, itemType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Items</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <input
                type="text"
                placeholder="e.g., Electronics..."
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <input
                type="text"
                placeholder="e.g., Blue..."
                value={filters.color}
                onChange={(e) => setFilters({ ...filters, color: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Link
            href="/search-request"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
          >
            Create Search Request
          </Link>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">Items ({filteredItems.length})</h2>
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No items found matching your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.itemType === "lost" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.itemType === "lost" ? "Lost" : "Found"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                    <div className="space-y-1 text-sm text-gray-600 mb-4">
                      <p>
                        <span className="font-medium">Location:</span> {item.location}
                      </p>
                      <p>
                        <span className="font-medium">Category:</span> {item.category}
                      </p>
                      {item.color && (
                        <p>
                          <span className="font-medium">Color:</span> {item.color}
                        </p>
                      )}
                      <p>
                        <span className="font-medium">Posted by:</span> {item.userName}
                      </p>
                    </div>
                    <a
                      href={`mailto:${item.userEmail}`}
                      className="block w-full bg-blue-600 text-white py-2 rounded text-center hover:bg-blue-700 transition text-sm font-medium"
                    >
                      Contact Poster
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
