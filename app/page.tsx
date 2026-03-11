"use client"

import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">Digital Lost & Found System</h1>
          <p className="text-xl text-gray-700 mb-8">AI-powered matching to reunite you with your lost items</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Lost Something?</h2>
            <p className="text-gray-600 mb-6">Report your lost item and let our AI help find it.</p>
            <Link
              href="/upload?type=lost"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Report Lost Item
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Found Something?</h2>
            <p className="text-gray-600 mb-6">Help someone find their lost item by reporting what you found.</p>
            <Link
              href="/upload?type=found"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
            >
              Report Found Item
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-12">
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-4xl font-bold text-blue-600 mb-2">AI Powered</div>
            <p className="text-gray-600">Smart matching using text & image analysis</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-4xl font-bold text-green-600 mb-2">Fast</div>
            <p className="text-gray-600">Instant notifications on matches</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <div className="text-4xl font-bold text-purple-600 mb-2">Secure</div>
            <p className="text-gray-600">Your data is protected</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Advanced Image Matching</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Our AI analyzes colors, objects, and visual patterns to find potential matches beyond text descriptions. See
            visual similarity scores and detailed feature analysis.
          </p>
          <Link
            href="/image-match"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            View Image Matches
          </Link>
        </div>
      </div>
    </main>
  )
}
