import { createReadStream } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createOpenAIClient, requireApiKey } from './openai-client.js'

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

function decodeImageResponse(response) {
  const item = response.data?.[0]
  if (!item) throw new Error('Image API returned no image data.')
  if (item.b64_json) return Buffer.from(item.b64_json, 'base64')
  throw new Error('Image API returned a URL instead of b64_json; this workflow expects b64_json output.')
}

async function retryImageJob(label, run) {
  const attempts = Number(process.env.JIANSHENG_IMAGE_ATTEMPTS || 3)
  let lastError
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await run()
    } catch (error) {
      lastError = error
      const status = error?.status || error?.response?.status
      const retryable = status === 408 || status === 409 || status === 429 || status >= 500
      if (!retryable || attempt === attempts) break
      const delay = 2500 * attempt
      console.warn(`${label} failed on attempt ${attempt}/${attempts}; retrying in ${delay}ms.`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
  throw lastError
}

export async function restoreImage({ prompt, output, size = '1536x1024', quality = 'high' }) {
  requireApiKey()
  const client = createOpenAIClient()
  const response = await retryImageJob('images.generate', () =>
    client.images.generate({
      model: process.env.JIANSHENG_IMAGE_MODEL || 'gpt-image-2',
      prompt,
      size,
      quality,
    }),
  )
  const image = decodeImageResponse(response)
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, image)
  return output
}

export async function restoreImageFromPromptAndImage({
  image,
  prompt,
  output,
  size = '1536x1024',
  quality = 'high',
}) {
  requireApiKey()
  const client = createOpenAIClient()
  const response = await retryImageJob('images.edit', () =>
    client.images.edit({
      model: process.env.JIANSHENG_IMAGE_MODEL || 'gpt-image-2',
      image: createReadStream(image),
      prompt,
      size,
      quality,
    }),
  )
  const restored = decodeImageResponse(response)
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, restored)
  return output
}

if (isDirectRun) {
  const args = process.argv.slice(2)
  const imageIndex = args.indexOf('--image')
  const promptIndex = args.indexOf('--prompt-file')
  const outputIndex = args.indexOf('--output')
  const image = imageIndex >= 0 ? args[imageIndex + 1] : undefined
  const promptFile = promptIndex >= 0 ? args[promptIndex + 1] : args[0]
  const output = outputIndex >= 0 ? args[outputIndex + 1] : args[1]
  if (!promptFile || !output) {
    console.error('Usage: node step2-restore.js --image input.jpg --prompt-file prompt.txt --output restored.jpg')
    process.exit(1)
  }
  const prompt = await fs.readFile(promptFile, 'utf8')
  const job = image
    ? restoreImageFromPromptAndImage({ image, prompt, output })
    : restoreImage({ prompt, output })
  job
    .then((file) => console.log(file))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
