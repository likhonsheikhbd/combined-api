"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EnhancedModelSelector } from "./enhanced-model-selector"
import { ModelInfo } from "./model-info"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { TypingIndicator } from "./typing-indicator"
import { useEnhancedChat } from "@/hooks/use-enhanced-chat"
import type { ModelConfigKey } from "@/lib/model-configs"
import { Bot, Trash2, RotateCcw } from "lucide-react"
import { toast } from "sonner"
import { StreamTestPanel } from "./stream-test-panel"

export function Chat() {
  const [selectedModel, setSelectedModel] = useState<ModelConfigKey>("gemini_15_pro_v0")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [performanceMetrics, setPerformanceMetrics] = useState({
    lastResponseTime: 0,
    tokensPerSecond: 0,
    hasErrors: false,
  })

  const {
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
  } = useEnhancedChat({ selectedModel })

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Handle model change
  const handleModelChange = (newModel: ModelConfigKey) => {
    if (messages.length > 0) {
      toast.info("Model changed. Previous conversation context will be maintained.")
    }
    setSelectedModel(newModel)
  }

  // Handle clear chat
  const handleClearChat = () => {
    clearChat()
    toast.success("Chat cleared")
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">Geploy AI Chat</CardTitle>
            <div className="flex items-center gap-2">
              <EnhancedModelSelector selectedModel={selectedModel} onModelChange={handleModelChange} />
              {messages.length > 0 && (
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={reload} disabled={isLoading}>
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

      {/* Model Info */}
      <ModelInfo selectedModel={selectedModel} />

      {/* Performance Monitor */}
      <StreamTestPanel
        isStreaming={isLoading || isTyping}
        lastResponseTime={performanceMetrics.lastResponseTime}
        tokensPerSecond={performanceMetrics.tokensPerSecond}
        hasErrors={performanceMetrics.hasErrors || !!error}
      />

      {/* Messages */}
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="h-full">
            <div className="p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Start a conversation</p>
                    <p className="text-sm mt-2">Choose from Gemini 1.5 Pro, Flash, or experimental variants</p>
                    <p className="text-xs mt-2 text-muted-foreground/70">
                      Your messages are processed with real-time streaming
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage key={message.id} role={message.role} content={message.content} />
                  ))}
                  {isTyping && <TypingIndicator />}
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
          isTyping={isTyping}
        />
      </Card>

      {/* Error Display */}
      {error && (
        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm text-destructive">Error: {error.message}</p>
        </div>
      )}
    </div>
  )
}
