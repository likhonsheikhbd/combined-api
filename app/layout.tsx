import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Geploy AI - Multi-Model Chat Interface",
  description:
    "A powerful, prompt-switchable chat interface powered by multiple AI models including Gemini, GPT, and Claude. Built with Next.js 14 and the Vercel AI SDK.",
  keywords: ["AI", "Chat", "Gemini", "GPT", "Claude", "Next.js", "Vercel"],
  authors: [{ name: "Likhon Sheikh", url: "https://github.com/likhonsdev" }],
  creator: "Likhon Sheikh",
  openGraph: {
    title: "Geploy AI - Multi-Model Chat Interface",
    description: "Chat with multiple AI models in one interface",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Geploy AI - Multi-Model Chat Interface",
    description: "Chat with multiple AI models in one interface",
    creator: "@likhonsheikh",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                border: "1px solid hsl(var(--border))",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
