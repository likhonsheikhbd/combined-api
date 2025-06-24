"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Play, Square, Download } from "lucide-react"
import type { ModelConfigKey } from "@/lib/model-configs"
import { toast } from "sonner"

interface StreamMetrics {
  startTime: number
  firstTokenTime?: number
  endTime?: number
  totalTokens: number
  tokensPerSecond: number
  latency: number
  errors: string[]
  modelUsed: string
  promptUsed: string
}

interface StreamTestMonitorProps {
  selectedModel: ModelConfigKey
  onTestComplete: (metrics: StreamMetrics) => void
}

const TEST_MESSAGES = [
  "Explain quantum computing in simple terms",
  "Write a short story about a robot learning to paint",
  "Create a step-by-step guide for making sourdough bread",
  "Analyze the pros and cons of renewable energy",
  "Design a simple REST API for a todo application",
]

export function StreamTestMonitor({ selectedModel, onTestComplete }: StreamTestMonitorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState(0)
  const [metrics, setMetrics] = useState<StreamMetrics[]>([])
  const [currentMetrics, setCurrentMetrics] = useState<Partial<StreamMetrics>>({})
  const [streamedContent, setStreamedContent] = useState("")
  const [progress, setProgress] = useState(0)

  const abortControllerRef = useRef<AbortController | null>(null)

  const runStreamTest = async (message: string, testIndex: number) => {
    const startTime = Date.now()
    let firstTokenTime: number | undefined
    let totalTokens = 0
    const errors: string[] = []

    setCurrentMetrics({
      startTime,
      totalTokens: 0,
      tokensPerSecond: 0,
      latency: 0,
      errors: [],
      modelUsed: selectedModel,
      promptUsed: message,
    })

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: message }],
          model: selectedModel,
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No response body reader")

      const decoder = new TextDecoder()
      let buffer = ""
      let content = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        if (!firstTokenTime) {
          firstTokenTime = Date.now()
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.type === "text-delta") {
                content += data.textDelta
                totalTokens++
                setStreamedContent(content)
                setCurrentMetrics((prev) => ({
                  ...prev,
                  totalTokens,
                  tokensPerSecond: totalTokens / ((Date.now() - startTime) / 1000),
                }))
              }
            } catch (e) {
              // Ignore parsing errors for non-JSON lines
            }
          }
        }
      }

      const endTime = Date.now()
      const finalMetrics: StreamMetrics = {
        startTime,
        firstTokenTime,
        endTime,
        totalTokens,
        tokensPerSecond: totalTokens / ((endTime - startTime) / 1000),
        latency: firstTokenTime ? firstTokenTime - startTime : 0,
        errors,
        modelUsed: selectedModel,
        promptUsed: message,
      }

      setMetrics((prev) => [...prev, finalMetrics])
      onTestComplete(finalMetrics)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      errors.push(errorMessage)
      console.error("Stream test error:", error)

      const failedMetrics: StreamMetrics = {
        startTime,
        firstTokenTime,
        endTime: Date.now(),
        totalTokens,
        tokensPerSecond: 0,
        latency: 0,
        errors,
        modelUsed: selectedModel,
        promptUsed: message,
      }

      setMetrics((prev) => [...prev, failedMetrics])
      toast.error(`Test failed: ${errorMessage}`)
    }
  }

  const startComprehensiveTest = async () => {
    setIsRunning(true)
    setMetrics([])
    setCurrentTest(0)
    setProgress(0)

    try {
      for (let i = 0; i < TEST_MESSAGES.length; i++) {
        if (!isRunning) break

        setCurrentTest(i)
        setStreamedContent("")
        await runStreamTest(TEST_MESSAGES[i], i)
        setProgress(((i + 1) / TEST_MESSAGES.length) * 100)

        // Brief pause between tests
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      toast.success("Test suite completed successfully")
    } catch (error) {
      toast.error("Test suite failed")
    } finally {
      setIsRunning(false)
    }
  }

  const stopTest = () => {
    setIsRunning(false)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    toast.info("Test stopped")
  }

  const exportResults = () => {
    if (metrics.length === 0) {
      toast.error("No results to export")
      return
    }

    try {
      const results = {
        timestamp: new Date().toISOString(),
        model: selectedModel,
        totalTests: metrics.length,
        averageLatency: metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length,
        averageTokensPerSecond: metrics.reduce((sum, m) => sum + m.tokensPerSecond, 0) / metrics.length,
        totalErrors: metrics.reduce((sum, m) => sum + m.errors.length, 0),
        detailedMetrics: metrics,
      }

      const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `stream-test-results-${selectedModel}-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Results exported successfully")
    } catch (error) {
      toast.error("Failed to export results")
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Stream Performance Monitor
            <div className="flex gap-2">
              <Button onClick={startComprehensiveTest} disabled={isRunning} size="sm">
                <Play className="w-4 h-4 mr-2" />
                Start Test
              </Button>
              <Button onClick={stopTest} disabled={!isRunning} variant="destructive" size="sm">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
              <Button onClick={exportResults} disabled={metrics.length === 0} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isRunning && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Test Progress</span>
                  <span>
                    {currentTest + 1} / {TEST_MESSAGES.length}
                  </span>
                </div>
                <Progress value={progress} />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentMetrics.totalTokens || 0}</div>
                  <div className="text-sm text-muted-foreground">Tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{Math.round(currentMetrics.tokensPerSecond || 0)}</div>
                  <div className="text-sm text-muted-foreground">Tokens/sec</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentMetrics.latency || 0}ms</div>
                  <div className="text-sm text-muted-foreground">Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{currentMetrics.errors?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Current Test: {TEST_MESSAGES[currentTest]}</div>
                <ScrollArea className="h-32 border rounded p-2">
                  <div className="text-sm whitespace-pre-wrap">{streamedContent}</div>
                </ScrollArea>
              </div>
            </div>
          )}

          {metrics.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Test Results Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{metrics.length}</div>
                  <div className="text-sm text-muted-foreground">Tests Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(metrics.reduce((sum, m) => sum + m.latency, 0) / metrics.length)}ms
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Latency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(metrics.reduce((sum, m) => sum + m.tokensPerSecond, 0) / metrics.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Tokens/sec</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {metrics.reduce((sum, m) => sum + m.errors.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Errors</div>
                </div>
              </div>

              <ScrollArea className="h-48">
                <div className="space-y-2">
                  {metrics.map((metric, index) => (
                    <div key={index} className="border rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Test {index + 1}</span>
                        <div className="flex gap-2">
                          <Badge variant={metric.errors.length > 0 ? "destructive" : "default"}>
                            {metric.errors.length > 0 ? "Failed" : "Success"}
                          </Badge>
                          <Badge variant="outline">{Math.round(metric.tokensPerSecond)} t/s</Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground truncate">{metric.promptUsed}</div>
                      {metric.errors.length > 0 && (
                        <div className="text-sm text-red-500 mt-1">Errors: {metric.errors.join(", ")}</div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
