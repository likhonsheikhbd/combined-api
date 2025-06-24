"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StreamTestMonitor } from "@/components/stream-test-monitor"
import { EnhancedModelSelector } from "@/components/enhanced-model-selector"
import type { ModelConfigKey } from "@/lib/model-configs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TestPage() {
  const [selectedModel, setSelectedModel] = useState<ModelConfigKey>("gemini_15_pro_v0")
  const [testResults, setTestResults] = useState<any[]>([])

  const handleTestComplete = (metrics: any) => {
    setTestResults((prev) => [...prev, metrics])
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Streaming Performance Test Suite</h1>
        <p className="text-muted-foreground">
          Comprehensive testing of real-time streaming functionality across different models and prompts.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <EnhancedModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />
          </CardContent>
        </Card>

        <StreamTestMonitor selectedModel={selectedModel} onTestComplete={handleTestComplete} />

        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Performance Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {testResults.filter((r) => r.errors.length === 0).length}
                    </div>
                    <div className="text-sm text-muted-foreground">Successful Tests</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(testResults.reduce((sum, r) => sum + r.latency, 0) / testResults.length)}ms
                    </div>
                    <div className="text-sm text-muted-foreground">Average First Token</div>
                  </div>
                  <div className="text-center p-4 border rounded">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(testResults.reduce((sum, r) => sum + r.tokensPerSecond, 0) / testResults.length)}
                    </div>
                    <div className="text-sm text-muted-foreground">Average Throughput</div>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <h3 className="font-semibold mb-2">Test Criteria:</h3>
                  <ul className="space-y-1">
                    <li>• ✅ First token latency {"<"} 2000ms</li>
                    <li>• ✅ Streaming throughput {">"} 10 tokens/second</li>
                    <li>• ✅ Zero connection errors</li>
                    <li>• ✅ Consistent response quality</li>
                    <li>• ✅ Proper model and prompt application</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
