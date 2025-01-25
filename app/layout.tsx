import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "🍊 新 年 快 乐 🧧",
  description: "Learn your CNY greetings 😏",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <div className="fixed bottom-2 text-center text-xs text-yellow-100/60 w-full hover:text-yellow-100/80 transition-colors duration-300">
            Built by <a href="https://gabrielchua.me" className="underline hover:text-yellow-100" target="_blank" rel="noopener noreferrer">Gabriel Chua</a> with o1 Pro and Cursor
          </div>
        </Providers>
      </body>
    </html>
  )
}

