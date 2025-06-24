"use client"

import { ErrorBoundary } from "@/components/error-boundary"
import { ChatInterface } from "@/components/chat-interface"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <ErrorBoundary>
          <ChatInterface />
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
