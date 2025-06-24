import { google } from "@ai-sdk/google"
import { streamText } from "ai"
import { fetchPrompt } from "@/lib/fetch-prompt"
import { modelConfigs } from "@/lib/model-configs"
import { availableModels } from "@/lib/model-checker"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages, model } = await req.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 })
    }

    // Get the selected model config
    const modelConfig = modelConfigs[model as keyof typeof modelConfigs]
    if (!modelConfig) {
      return new Response("Invalid model selected", { status: 400 })
    }

    // Fetch the system prompt with timeout
    const systemPrompt = await Promise.race([
      fetchPrompt(modelConfig.promptUrl),
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error("Prompt fetch timeout")), 5000)),
    ]).catch(() => "You are a helpful AI assistant.")

    // Abort early if the Google API key is missing – avoids hard-to-debug 500s
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "missing_api_key",
          message:
            "GOOGLE_GENERATIVE_AI_API_KEY is not set. Add it to your Vercel env vars or .env.local before retrying.",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      )
    }

    // Use fallback if model not available
    let selectedModel = modelConfig.model
    if (!availableModels.includes(selectedModel)) {
      console.warn(`Model ${selectedModel} not available, falling back to gemini-1.5-flash-latest`)
      selectedModel = "gemini-1.5-flash-latest"
    }

    // Stream with enhanced configuration
    const result = streamText({
      model: google(selectedModel),
      system: systemPrompt,
      messages, // no conversion needed
      temperature: 0.7,
      maxTokens: 4000,
      // Enhanced streaming options
      onFinish: async ({ text, finishReason, usage }) => {
        console.log("Stream finished:", { finishReason, usage })
      },
    })

    return result.toDataStreamResponse({
      headers: {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)

    // Return structured error response
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
