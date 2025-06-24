"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TestTube, Clock, Zap, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

interface StreamTestPanelProps {
  isStreaming: boolean
  lastResponseTime?: number
  tokensPerSecond?: number
  hasErrors: boolean
}

export function StreamTestPanel({ isStreaming, lastResponseTime, tokensPerSecond, hasErrors }: StreamTestPanelProps) {
  const [testMode, setTestMode] = useState(false)

  const getPerformanceStatus = () => {
    if (!lastResponseTime) return "pending"
    if (lastResponseTime < 1000) return "excellent"
    if (lastResponseTime < 2000) return "good"
    return "needs-improvement"
  }

  const getThroughputStatus = () => {
    if (!tokensPerSecond) return "pending"
    if (tokensPerSecond > 20) return "excellent"
    if (tokensPerSecond > 10) return "good"
    return "needs-improvement"
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            Stream Performance Monitor
          </div>
          <Link href="/test">
            <Button variant="outline" size="sm">
              Full Test Suite
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Latency</div>
              <div className="flex items-center gap-1">
                <span className="text-xs">{lastResponseTime ? `${lastResponseTime}ms` : "—"}</span>
                <Badge variant={getPerformanceStatus() === "excellent" ? "default" : "secondary"} className="text-xs">
                  {getPerformanceStatus()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Throughput</div>
              <div className="flex items-center gap-1">
                <span className="text-xs">{tokensPerSecond ? `${Math.round(tokensPerSecond)} t/s` : "—"}</span>
                <Badge variant={getThroughputStatus() === "excellent" ? "default" : "secondary"} className="text-xs">
                  {getThroughputStatus()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isStreaming ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm">Streaming</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="text-sm">Ready</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasErrors ? (
              <>
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">Errors</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-500">Healthy</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
