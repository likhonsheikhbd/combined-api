"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { modelConfigs, type ModelConfigKey } from "@/lib/model-configs"

interface ModelSelectorProps {
  selectedModel: ModelConfigKey
  onModelChange: (model: ModelConfigKey) => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Model:</span>
      <Select value={selectedModel} onValueChange={onModelChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(modelConfigs).map(([key, config]) => (
            <SelectItem key={key} value={key}>
              {config.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
