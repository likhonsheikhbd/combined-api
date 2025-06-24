"use client"

import { Bot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start">
      <div className="flex gap-3 max-w-[85%]">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
          <div className="flex items-center gap-1">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
