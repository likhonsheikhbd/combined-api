"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { modelConfigs, type ModelConfigKey } from "@/lib/model-configs"
import { Brain, Sparkles, Info } from "lucide-react"

interface ModelInfoProps {
  selectedModel: ModelConfigKey
}

const categoryColors = {
  "Gemini 1.5": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  Experimental: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}

const categoryIcons = {
  "Gemini 1.5": <Sparkles className="w-3 h-3" />,
  Experimental: <Brain className="w-3 h-3" />,
}

export function ModelInfo({ selectedModel }: ModelInfoProps) {
  const config = modelConfigs[selectedModel] ?? null
  if (!config) return null

  return (
    <Card className="mb-4">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Active Model:</span>
            <Badge className={`flex items-center gap-1 ${categoryColors[config.category]}`}>
              {categoryIcons[config.category]}
              {config.category}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">{config.model}</div>
        </div>
        <div className="mt-2 text-sm text-muted-foreground">{config.name}</div>
      </CardContent>
    </Card>
  )
}
