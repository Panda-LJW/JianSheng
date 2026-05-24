import { existsSync, readFileSync } from 'node:fs'
import OpenAI from 'openai'

loadEnvFile()

function loadEnvFile(file = '.env') {
  if (!existsSync(file)) return
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const equalsAt = trimmed.indexOf('=')
    if (equalsAt < 0) continue
    const key = trimmed.slice(0, equalsAt).trim()
    const rawValue = trimmed.slice(equalsAt + 1).trim()
    if (!key || process.env[key] !== undefined) continue
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, '')
  }
}

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
