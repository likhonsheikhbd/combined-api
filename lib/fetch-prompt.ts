export async function fetchPrompt(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch prompt: ${response.statusText}`)
    }
    return await response.text()
  } catch (error) {
    console.error("Error fetching prompt:", error)
    return "You are a helpful AI assistant." // Fallback prompt
  }
}
