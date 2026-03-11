"use client"

import type React from "react"

import { useState, useRef } from "react"

interface ImageUploadProps {
  onImageSelect: (file: File) => void
}

export default function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [preview, setPreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      onImageSelect(file)
    }
  }

  return (
    <div>
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition"
      >
        {preview ? (
          <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-48 mx-auto" />
        ) : (
          <div>
            <p className="text-gray-600">Click to upload an image</p>
            <p className="text-sm text-gray-500">or drag and drop</p>
          </div>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
    </div>
  )
}
