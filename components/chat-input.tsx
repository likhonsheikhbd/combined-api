"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Square, Loader2 } from "lucide-react"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleStop: () => void
  isLoading: boolean
  isTyping: boolean
  disabled?: boolean
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  handleStop,
  isLoading,
  isTyping,
  disabled = false,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [rows, setRows] = useState(1)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = "auto"
      const scrollHeight = textarea.scrollHeight
      const lineHeight = 24 // Approximate line height
      const newRows = Math.min(Math.max(Math.ceil(scrollHeight / lineHeight), 1), 6)
      setRows(newRows)
    }
  }, [input])

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim() && !disabled) {
        handleSubmit(e as any)
      }
    }
  }

  const isInputDisabled = isLoading || disabled
  const canSend = input.trim() && !isInputDisabled

  return (
    <div className="border-t p-4 bg-background">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled ? "Chat is offline..." : "Type your message... (Enter to send, Shift+Enter for new line)"
            }
            disabled={isInputDisabled}
            rows={rows}
            className="min-h-[44px] max-h-[144px] resize-none pr-12"
          />
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">{input.length}/4000</div>
        </div>

        {isLoading || isTyping ? (
          <Button
            type="button"
            onClick={handleStop}
            variant="destructive"
            size="sm"
            className="h-11 px-3"
            disabled={disabled}
          >
            <Square className="w-4 h-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={!canSend} size="sm" className="h-11 px-3">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        )}
      </form>

      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>
          {input.length > 3500 && "Approaching character limit"}
          {disabled && "Connection required"}
        </span>
      </div>
    </div>
  )
}
