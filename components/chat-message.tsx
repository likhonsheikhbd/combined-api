"use client"

import { memo } from "react"
import { Bot, User, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  isStreaming?: boolean
}

export const ChatMessage = memo(function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      toast.success("Copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error("Failed to copy")
    }
  }

  return (
    <div className={`flex gap-3 ${role === "user" ? "justify-end" : "justify-start"} chat-message`}>
      <div className={`flex gap-3 max-w-[85%] ${role === "user" ? "flex-row-reverse" : "flex-row"}`}>
        <div className="flex-shrink-0">
          {role === "user" ? (
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 min-w-0">
          <div
            className={`rounded-lg p-3 relative group ${
              role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {content}
              {isStreaming && <span className="inline-block w-2 h-5 bg-current ml-1 animate-pulse" />}
            </div>

            {role === "assistant" && content && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
})
