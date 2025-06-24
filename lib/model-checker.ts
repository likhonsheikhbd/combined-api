import { google } from "@ai-sdk/google"
import { generateText } from "ai"

export async function checkModelAvailability(modelName: string): Promise<boolean> {
  try {
    await generateText({
      model: google(modelName),
      prompt: "Test",
      maxTokens: 10,
    })
    return true
  } catch (error) {
    console.warn(`Model ${modelName} not available:`, error)
    return false
  }
}

export const availableModels = [
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
]
