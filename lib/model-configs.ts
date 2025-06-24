export const modelConfigs = {
  // Gemini Models
  gemini_15_pro_v0: {
    name: "Gemini 1.5 Pro (V0.dev prompt)",
    model: "gemini-1.5-pro-latest",
    promptUrl:
      "https://raw.githubusercontent.com/lucasmrdt/TheBigPromptLibrary/main/SystemPrompts/V0.dev/20240904-V0.md",
    category: "Gemini 1.5",
    provider: "google",
  },
  gemini_15_flash_cursor: {
    name: "Gemini 1.5 Flash (Cursor.com prompt)",
    model: "gemini-1.5-flash-latest",
    promptUrl:
      "https://raw.githubusercontent.com/lucasmrdt/TheBigPromptLibrary/main/SystemPrompts/Cursor.com/20240904-Cursor.md",
    category: "Gemini 1.5",
    provider: "google",
  },
  gemini_15_flash_gpt4o: {
    name: "Gemini 1.5 Flash (GPT-4o prompt)",
    model: "gemini-1.5-flash-latest",
    promptUrl:
      "https://raw.githubusercontent.com/lucasmrdt/TheBigPromptLibrary/main/SystemPrompts/ChatGPT/gpt4o_20240904.md",
    category: "Gemini 1.5",
    provider: "google",
  },
  gemini_15_pro_claude: {
    name: "Gemini 1.5 Pro (Claude prompt)",
    model: "gemini-1.5-pro-latest",
    promptUrl:
      "https://raw.githubusercontent.com/lucasmrdt/TheBigPromptLibrary/main/SystemPrompts/Claude/20240712-Claude3.5-Sonnet.md",
    category: "Gemini 1.5",
    provider: "google",
  },

  // OpenAI Models
  gpt4_turbo: {
    name: "GPT-4 Turbo",
    model: "gpt-4-turbo-preview",
    promptUrl:
      "https://raw.githubusercontent.com/lucasmrdt/TheBigPromptLibrary/main/SystemPrompts/ChatGPT/gpt4o_20240904.md",
    category: "OpenAI",
    provider: "openai",
  },
  gpt35_turbo: {
    name: "GPT-3.5 Turbo",
    model: "gpt-3.5-turbo",
    promptUrl:
      "https://raw.githubusercontent.com/lucasmrdt/TheBigPromptLibrary/main/SystemPrompts/ChatGPT/gpt4o_20240904.md",
    category: "OpenAI",
    provider: "openai",
  },

  // Claude Models
  claude_35_sonnet: {
    name: "Claude 3.5 Sonnet",
    model: "claude-3-5-sonnet-20241022",
    promptUrl:
      "https://raw.githubusercontent.com/lucasmrdt/TheBigPromptLibrary/main/SystemPrompts/Claude/20240712-Claude3.5-Sonnet.md",
    category: "Anthropic",
    provider: "anthropic",
  },
} as const

export type ModelConfigKey = keyof typeof modelConfigs

export const modelCategories = {
  "Gemini 1.5": "Google's latest Gemini models with advanced capabilities",
  OpenAI: "OpenAI's GPT models for versatile conversations",
  Anthropic: "Claude models known for helpful, harmless, and honest responses",
} as const
