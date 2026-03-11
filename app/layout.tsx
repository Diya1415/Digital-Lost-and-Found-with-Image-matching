import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Digital Lost & Found",
  description: "AI-powered system to find and match lost and found items",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <header className="bg-blue-600 text-white p-4 shadow-lg">
          <nav className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">
              <a href="/">Lost & Found</a>
            </h1>
            <div className="flex gap-4">
              <a href="/" className="hover:bg-blue-700 px-4 py-2 rounded">
                Home
              </a>
              <a href="/dashboard" className="hover:bg-blue-700 px-4 py-2 rounded">
                Dashboard
              </a>
              <a href="/image-match" className="hover:bg-blue-700 px-4 py-2 rounded">
                Image Match
              </a>
              <a href="/upload" className="hover:bg-blue-700 px-4 py-2 rounded">
                Upload
              </a>
              <a href="/account" className="hover:bg-blue-700 px-4 py-2 rounded">
                Account
              </a>
              <a href="/auth/login" className="hover:bg-blue-700 px-4 py-2 rounded">
                Login
              </a>
              <a href="/auth/signup" className="hover:bg-blue-700 px-4 py-2 rounded">
                Sign Up
              </a>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
