import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "🍊 新 年 快 乐 🧧",
  description: "Learn your CNY greetings 😏",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-red-500 to-yellow-500`}>
        <Providers>
          <main className="px-4 py-2 min-h-screen">
            {children}
          </main>
          <div className="fixed bottom-2 text-center text-xs text-yellow-100/60 w-full hover:text-yellow-100/80 transition-colors duration-300">
            Built by <a href="https://gabrielchua.me" className="underline hover:text-yellow-100" target="_blank" rel="noopener noreferrer">Gabriel Chua</a> with o1 Pro and Cursor
          </div>
        </Providers>
      </body>
    </html>
  )
}

