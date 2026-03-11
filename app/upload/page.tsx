"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ImageUpload from "@/components/ImageUpload"

function UploadContent() {
  const searchParams = useSearchParams()
  const defaultType = searchParams.get("type") || "lost"

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    itemType: defaultType,
  })

  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageSelect = (file: File) => {
    setImage(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!formData.title || !formData.description || !formData.location || !image) {
      setError("Please fill all fields and select an image")
      return
    }

    setLoading(true)

    try {
      const userData = localStorage.getItem("user")
      const user = userData ? JSON.parse(userData) : null

      if (!user) {
        setError("You must be logged in to upload items")
        setLoading(false)
        return
      }

      // Convert image to base64
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string

        const form = new FormData()
        form.append("title", formData.title)
        form.append("description", formData.description)
        form.append("itemType", formData.itemType)
        form.append("location", formData.location)
        form.append("image", base64Image)
        form.append("userId", user.id)
        form.append("userName", user.name)
        form.append("userEmail", user.email)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: form,
        })

        if (response.ok) {
          setSuccess(true)
          setFormData({ title: "", description: "", location: "", itemType: defaultType })
          setImage(null)
          setTimeout(() => window.location.reload(), 2000)
        } else {
          const data = await response.json()
          setError(data.error || "Failed to upload item")
        }
      }
      reader.readAsDataURL(image)
    } catch (err) {
      setError("An error occurred while uploading")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {formData.itemType === "lost" ? "Report Lost Item" : "Report Found Item"}
        </h1>
        <p className="text-gray-600 mb-8">
          {formData.itemType === "lost"
            ? "Describe your lost item so we can help find it"
            : "Help someone find their lost item"}
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Type</label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Blue Backpack"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the item in detail..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where was it lost/found?"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Item Image</label>
            <ImageUpload onImageSelect={handleImageSelect} />
            {image && <p className="text-sm text-green-600 mt-2">Image selected: {image.name}</p>}
          </div>

          {error && <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Item uploaded successfully! AI is now analyzing it for matches.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload Item"}
          </button>
        </form>
      </div>
    </main>
  )
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadContent />
    </Suspense>
  )
}
