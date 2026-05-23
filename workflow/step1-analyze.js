import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createOpenAIClient, requireApiKey } from './openai-client.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

export async function analyzePlace({ input, era }) {
  requireApiKey()
  const client = createOpenAIClient()
  const systemPrompt = await fs.readFile(path.join(__dirname, 'prompts/analyze-system.txt'), 'utf8')
  const imageBuffer = await fs.readFile(input)
  const base64Image = imageBuffer.toString('base64')

  const response = await client.chat.completions.create({
    model: process.env.JIANSHENG_ANALYSIS_MODEL || 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
          { type: 'text', text: `请为这个地点生成复原素材。目标年代：${era}` },
        ],
      },
    ],
    response_format: { type: 'json_object' },
  })

  const text = response.choices[0]?.message?.content
  if (!text) throw new Error('GPT-4o analysis returned empty content.')
  return JSON.parse(text)
}

if (isDirectRun) {
  const input = process.argv[2]
  const era = process.argv.slice(3).join(' ')
  if (!input || !era) {
    console.error('Usage: node step1-analyze.js <input.jpg> <target era>')
    process.exit(1)
  }
  analyzePlace({ input, era })
    .then((analysis) => console.log(JSON.stringify(analysis, null, 2)))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
