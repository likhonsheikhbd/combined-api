"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useState, useCallback, useRef, useEffect } from "react"
import type { ModelConfigKey } from "@/lib/model-configs"
import { toast } from "sonner"

interface UseEnhancedChatProps {
  selectedModel: ModelConfigKey
}

export function useEnhancedChat({ selectedModel }: UseEnhancedChatProps) {
  const [isTyping, setIsTyping] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
    isLoading,
    error,
    reload,
    stop,
    setMessages,
  } = useChat({
    api: "/api/chat",
    body: { model: selectedModel },
    onResponse: async (response) => {
      if (!response.ok) {
        // clone() avoids “Body is disturbed or locked”
        const cloned = response.clone()
        let msg = "Request failed"
        try {
          const data = await cloned.json()
          msg = data?.message ?? msg
        } catch {
          /* not JSON */
        }
        toast.error(msg)
      }
    },
    onError: (err) => {
      console.error("Chat error:", err)
      toast.error("Something went wrong. Please try again.")
    },
    onFinish: () => setIsTyping(false),
  })

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!input.trim() || isLoading) return

      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      setIsTyping(true)
      originalHandleSubmit(e)
    },
    [input, isLoading, originalHandleSubmit],
  )

  const handleStop = useCallback(() => {
    stop()
    setIsTyping(false)
    abortControllerRef.current?.abort()
  }, [stop])

  const clearChat = useCallback(() => {
    setMessages([])
    setIsTyping(false)
  }, [setMessages])

  useEffect(() => () => abortControllerRef.current?.abort(), [])

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    handleStop,
    clearChat,
    reload,
    isLoading,
    isTyping,
    error,
  }
}
