"use client"

import React, { useRef, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { EnhancedModelSelector } from "./enhanced-model-selector"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { useChatSDK } from "@/hooks/use-chat-sdk"
import type { ModelConfigKey } from "@/lib/model-configs"
import { Bot, Trash2, RotateCcw, Wifi, WifiOff } from "lucide-react"
import { toast } from "sonner"
import { chatAPI } from "@/lib/api-client"

export const ChatInterface = React.memo(function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState<ModelConfigKey>("gemini_15_pro_v0")
  const [isOnline, setIsOnline] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
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
  } = useChatSDK({
    selectedModel,
    onError: (error) => {
      console.error("Chat SDK error:", error)
    },
    onSuccess: () => {
      console.log("Message sent successfully")
    },
  })

  // Check API connectivity
  useEffect(() => {
    const checkConnectivity = async () => {
      try {
        const isConnected = await chatAPI.testConnection()
        setIsOnline(isConnected)
        if (!isConnected) {
          toast.error("Unable to connect to chat API")
        }
      } catch {
        setIsOnline(false)
      }
    }

    checkConnectivity()
    const interval = setInterval(checkConnectivity, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isStreaming])

  // Handle model change
  const handleModelChange = (newModel: ModelConfigKey) => {
    if (messages.length > 0) {
      toast.info("Model changed. Previous conversation context will be maintained.")
    }
    setSelectedModel(newModel)
  }

  // Handle clear chat
  const handleClearChat = () => {
    clearMessages()
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl font-bold">Geploy AI Chat</CardTitle>
              <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
                {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <EnhancedModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
              {messages.length > 0 && (
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={retry} disabled={isLoading}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearChat} disabled={isLoading}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center max-w-md">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                    <p className="text-sm mb-4">
                      Choose from multiple AI models including Gemini, GPT, and Claude. Your messages are processed with
                      real-time streaming.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Badge variant="secondary">Real-time Streaming</Badge>
                      <Badge variant="secondary">Multiple Models</Badge>
                      <Badge variant="secondary">Prompt Switching</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      role={message.role}
                      content={message.content}
                      isStreaming={isStreaming && message === messages[messages.length - 1]}
                    />
                  ))}
                  {isStreaming && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </ScrollArea>
        </CardContent>

        {/* Input */}
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleStop={handleStop}
          isLoading={isLoading}
          isTyping={isStreaming}
          disabled={!isOnline}
        />
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mt-2 border-destructive/20 bg-destructive/5">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-destructive">Error: {error.message}</p>
              <Button variant="outline" size="sm" onClick={retry}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
})
