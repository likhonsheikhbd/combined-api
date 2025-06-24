import { google } from "@ai-sdk/google"
import { generateText } from "ai"

const modelsToTest = [
  "gemini-1.5-pro-latest",
  "gemini-1.5-flash-latest", 
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
]

async function testModels() {
  console.log("Testing Google AI models...")

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing ${modelName}...`)
      const result = await generateText({
        model: google(modelName),
        prompt: "Say hello in one word",
        maxTokens: 10,
      })
      console.log(`✅ ${modelName}: ${result.text}`)
    } catch (error) {
      console.log(`❌ ${modelName}: ${error.message}`)
    }
  }
}

testModels().catch(console.error)
