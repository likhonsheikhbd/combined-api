"use client"

import type React from "react"

import { useState, useCallback, useRef, useEffect } from "react"
import { chatAPI } from "@/lib/api-client"
import type { ModelConfigKey } from "@/lib/model-configs"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface UseChatSDKProps {
  selectedModel: ModelConfigKey
  onError?: (error: Error) => void
  onSuccess?: () => void
}

export function useChatSDK({ selectedModel, onError, onSuccess }: UseChatSDKProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const messagesRef = useRef<Message[]>([])

  // Keep messages ref in sync
  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  const generateId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">) => {
      const newMessage: Message = {
        ...message,
        id: generateId(),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      return newMessage
    },
    [generateId],
  )

  const updateLastMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const updated = [...prev]
      if (updated.length > 0 && updated[updated.length - 1].role === "assistant") {
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content,
        }
      }
      return updated
    })
  }, [])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const sendMessage = useCallback(
    async (messageContent: string) => {
      if (!messageContent.trim() || isLoading) return

      setError(null)
      setIsLoading(true)
      setIsStreaming(true)

      // Add user message
      const userMessage = addMessage({
        role: "user",
        content: messageContent.trim(),
      })

      // Add empty assistant message for streaming
      const assistantMessage = addMessage({
        role: "assistant",
        content: "",
      })

      try {
        const response = await chatAPI.sendMessage({
          messages: [
            ...messagesRef.current.slice(0, -1).map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            { role: "user", content: messageContent.trim() },
          ],
          model: selectedModel,
          stream: true,
        })

        const reader = response.body?.getReader()
        if (!reader) throw new Error("No response body reader available")

        const decoder = new TextDecoder()
        let buffer = ""
        let fullContent = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split("\n")
          buffer = lines.pop() || ""

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.choices && data.choices[0]?.delta?.content) {
                  const deltaContent = data.choices[0].delta.content
                  fullContent += deltaContent
                  updateLastMessage(fullContent)
                } else if (data.choices && data.choices[0]?.message?.content) {
                  fullContent = data.choices[0].message.content
                  updateLastMessage(fullContent)
                }
              } catch (e) {
                // Ignore parsing errors for non-JSON lines
                console.warn("Failed to parse streaming data:", line)
              }
            }
          }
        }

        onSuccess?.()
        toast.success("Message sent successfully")
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
        setError(error instanceof Error ? error : new Error(errorMessage))

        // Remove the empty assistant message on error
        setMessages((prev) => prev.slice(0, -1))

        onError?.(error instanceof Error ? error : new Error(errorMessage))
        toast.error(`Failed to send message: ${errorMessage}`)
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
      }
    },
    [selectedModel, isLoading, addMessage, updateLastMessage, onError, onSuccess],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (input.trim()) {
        sendMessage(input)
        setInput("")
      }
    },
    [input, sendMessage],
  )

  const handleStop = useCallback(() => {
    chatAPI.abort()
    setIsLoading(false)
    setIsStreaming(false)
    toast.info("Request cancelled")
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
    toast.success("Chat cleared")
  }, [])

  const retry = useCallback(() => {
    if (messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find((msg) => msg.role === "user")
      if (lastUserMessage) {
        // Remove the last assistant message if it exists and retry
        setMessages((prev) => {
          const filtered = prev.filter(
            (msg) => !(msg.role === "assistant" && msg.timestamp > lastUserMessage.timestamp),
          )
          return filtered
        })
        sendMessage(lastUserMessage.content)
      }
    }
  }, [messages, sendMessage])

  return {
    messages,
    input,
    isLoading,
    isStreaming,
    error,
    handleInputChange,
    handleSubmit,
    handleStop,
    clearMessages,
    retry,
    sendMessage,
  }
}
