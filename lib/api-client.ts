interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  model: string
  stream?: boolean
}

interface ChatResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
  }>
}

export class ChatAPIClient {
  private baseURL = "https://combined-api.vercel.app"
  private abortController: AbortController | null = null

  async sendMessage(request: ChatRequest): Promise<Response> {
    this.abortController = new AbortController()

    try {
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...request,
          stream: true,
        }),
        signal: this.abortController.signal,
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return response
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request was cancelled")
      }
      throw error
    }
  }

  abort() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      return response.ok
    } catch {
      return false
    }
  }
}

export const chatAPI = new ChatAPIClient()
