"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { modelConfigs, modelCategories, type ModelConfigKey } from "@/lib/model-configs"
import { Brain, Sparkles } from "lucide-react"

interface EnhancedModelSelectorProps {
  selectedModel: ModelConfigKey
  onModelChange: (model: ModelConfigKey) => void
}

const categoryIcons = {
  "Gemini 1.5": <Sparkles className="w-4 h-4" />,
  Experimental: <Brain className="w-4 h-4" />,
}

export function EnhancedModelSelector({ selectedModel, onModelChange }: EnhancedModelSelectorProps) {
  const selectedConfig = modelConfigs[selectedModel] ?? null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">AI Model:</span>
        {selectedConfig && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {categoryIcons[selectedConfig.category]}
            {selectedConfig.category}
          </Badge>
        )}
      </div>

      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-[320px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[400px]">
          {Object.entries(modelCategories).map(([category, description]) => (
            <div key={category}>
              <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground border-b">
                <div className="flex items-center gap-2">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  {category}
                </div>
                <div className="text-xs font-normal text-muted-foreground mt-1">{description}</div>
              </div>
              {Object.entries(modelConfigs)
                .filter(([_, config]) => config.category === category)
                .map(([key, config]) => (
                  <SelectItem key={key} value={key} className="pl-6">
                    <div className="flex flex-col">
                      <span>{config.name}</span>
                      <span className="text-xs text-muted-foreground">Model: {config.model}</span>
                    </div>
                  </SelectItem>
                ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
