import OpenAI from 'openai'

export function createOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  })
}

export function requireApiKey() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OPENAI_API_KEY. Copy .env.example to .env or export OPENAI_API_KEY before running workflow scripts.')
  }
}
