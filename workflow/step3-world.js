import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const WORLD_API_BASE = process.env.WORLDLABS_API_BASE || 'https://api.worldlabs.ai/marble/v1'
const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

function getWorldLabsApiKey() {
  return process.env.WORLDLABS_API_KEY || process.env.WLT_API_KEY || process.env.WLT_API_KEY_VALUE
}

function requireWorldLabsApiKey() {
  const apiKey = getWorldLabsApiKey()
  if (!apiKey) {
    throw new Error('Missing WORLDLABS_API_KEY. Create an API key in the World Labs Platform and export WORLDLABS_API_KEY before running world generation.')
  }
  return apiKey
}

function extensionFor(file) {
  const ext = path.extname(file).slice(1).toLowerCase()
  if (!ext) return 'jpg'
  if (ext === 'jpeg') return 'jpg'
  return ext
}

function contentTypeFor(file) {
  const ext = extensionFor(file)
  if (ext === 'png') return 'image/png'
  if (ext === 'webp') return 'image/webp'
  return 'image/jpeg'
}

async function worldFetch(pathname, options = {}) {
  const apiKey = requireWorldLabsApiKey()
  const response = await fetch(`${WORLD_API_BASE}${pathname}`, {
    ...options,
    headers: {
      ...(options.body instanceof Buffer ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
      'WLT-Api-Key': apiKey,
    },
  })
  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }
  if (!response.ok) {
    throw new Error(`World Labs API ${response.status}: ${typeof data === 'string' ? data : JSON.stringify(data)}`)
  }
  return data
}

export async function prepareMediaUpload({ image, metadata = {} }) {
  const fileName = path.basename(image).slice(0, 64)
  return worldFetch('/media-assets:prepare_upload', {
    method: 'POST',
    body: JSON.stringify({
      file_name: fileName,
      kind: 'image',
      extension: extensionFor(image),
      metadata,
    }),
  })
}

export async function uploadMediaAsset({ image, uploadInfo }) {
  const uploadUrl = uploadInfo.upload_url
  if (!uploadUrl) throw new Error('World Labs prepare_upload response did not include upload_info.upload_url.')
  const requiredHeaders = uploadInfo.required_headers || {}
  const body = await fs.readFile(image)
  const response = await fetch(uploadUrl, {
    method: uploadInfo.upload_method || 'PUT',
    headers: {
      ...requiredHeaders,
      ...(Object.keys(requiredHeaders).some((key) => key.toLowerCase() === 'content-type')
        ? {}
        : { 'Content-Type': contentTypeFor(image) }),
    },
    body,
  })
  if (!response.ok) {
    throw new Error(`World Labs media upload ${response.status}: ${await response.text()}`)
  }
}

export async function generateWorld({ mediaAssetId, prompt, displayName, model = 'marble-1.1', tags = [] }) {
  return worldFetch('/worlds:generate', {
    method: 'POST',
    body: JSON.stringify({
      display_name: displayName?.slice(0, 64) || 'JianSheng restored world',
      model,
      world_prompt: {
        type: 'image',
        image_prompt: {
          source: 'media_asset',
          media_asset_id: mediaAssetId,
        },
        text_prompt: prompt,
      },
      permission: {
        public: false,
        allow_id_access: false,
        allowed_readers: [],
        allowed_writers: [],
      },
      tags: tags.slice(0, 10).map((tag) => String(tag).slice(0, 32)),
    }),
  })
}

export async function getOperation(operationId) {
  return worldFetch(`/operations/${encodeURIComponent(operationId)}`, { method: 'GET' })
}

export async function pollOperation({ operationId, intervalMs = 15000, timeoutMs = 900000, onPoll }) {
  const started = Date.now()
  while (Date.now() - started <= timeoutMs) {
    const operation = await getOperation(operationId)
    onPoll?.(operation)
    if (operation.done) {
      if (operation.error) {
        throw new Error(`World Labs operation failed: ${JSON.stringify(operation.error)}`)
      }
      return operation
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }
  throw new Error(`Timed out waiting for World Labs operation ${operationId}.`)
}

async function downloadUrl(url, output) {
  if (!url) return null
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to download ${url}: ${response.status}`)
  await fs.mkdir(path.dirname(output), { recursive: true })
  await fs.writeFile(output, Buffer.from(await response.arrayBuffer()))
  return output
}

export async function downloadWorldAssets({ world, outputDir }) {
  const assets = world?.assets || {}
  const downloaded = {}
  downloaded.thumbnail = await downloadUrl(assets.thumbnail_url, path.join(outputDir, 'thumbnail.jpg'))
  downloaded.pano = await downloadUrl(assets.imagery?.pano_url, path.join(outputDir, 'pano.jpg'))
  downloaded.colliderMesh = await downloadUrl(assets.mesh?.collider_mesh_url, path.join(outputDir, 'collider_mesh.glb'))
  const spzUrls = assets.splats?.spz_urls || {}
  downloaded.splats = {}
  for (const [quality, url] of Object.entries(spzUrls)) {
    downloaded.splats[quality] = await downloadUrl(url, path.join(outputDir, `splat-${quality}.spz`))
  }
  return downloaded
}

export async function createWorldFromImage({
  image,
  prompt,
  outputDir = 'workflow/output/world',
  displayName,
  model = process.env.WORLDLABS_MODEL || 'marble-1.1',
  wait = true,
  downloadAssets = true,
}) {
  await fs.mkdir(outputDir, { recursive: true })
  const prepare = await prepareMediaUpload({
    image,
    metadata: { project: 'jiansheng', source: 'workflow-step3-world' },
  })
  await fs.writeFile(path.join(outputDir, 'media-upload.json'), JSON.stringify(prepare, null, 2), 'utf8')

  await uploadMediaAsset({ image, uploadInfo: prepare.upload_info })
  const mediaAssetId = prepare.media_asset?.media_asset_id || prepare.media_asset?.id
  if (!mediaAssetId) throw new Error('World Labs prepare_upload response did not include a media asset id.')

  const operation = await generateWorld({
    mediaAssetId,
    prompt,
    displayName,
    model,
    tags: ['jiansheng', 'history', 'tourism'],
  })
  await fs.writeFile(path.join(outputDir, 'operation-start.json'), JSON.stringify(operation, null, 2), 'utf8')
  if (!wait) return { operation, mediaAssetId }

  const completed = await pollOperation({
    operationId: operation.operation_id,
    onPoll: (latest) => {
      const status = latest.metadata?.progress?.status || (latest.done ? 'DONE' : 'IN_PROGRESS')
      const progress = latest.metadata?.progress?.description || ''
      console.log(`[world] ${status} ${progress}`)
    },
  })
  await fs.writeFile(path.join(outputDir, 'operation-complete.json'), JSON.stringify(completed, null, 2), 'utf8')
  const world = completed.response
  if (world) {
    await fs.writeFile(path.join(outputDir, 'world.json'), JSON.stringify(world, null, 2), 'utf8')
    if (downloadAssets) {
      const downloaded = await downloadWorldAssets({ world, outputDir: path.join(outputDir, 'assets') })
      await fs.writeFile(path.join(outputDir, 'downloaded-assets.json'), JSON.stringify(downloaded, null, 2), 'utf8')
    }
  }
  return { operation: completed, mediaAssetId, world }
}

function parseArgs(argv) {
  const args = {}
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token.startsWith('--')) continue
    args[token.slice(2)] = argv[index + 1] || true
    if (argv[index + 1] && !argv[index + 1].startsWith('--')) index += 1
  }
  return args
}

async function readPrompt(args) {
  if (args.prompt) return args.prompt
  if (args['prompt-file']) return fs.readFile(args['prompt-file'], 'utf8')
  if (args.analysis) {
    const analysis = JSON.parse(await fs.readFile(args.analysis, 'utf8'))
    return analysis.restoration_prompt || analysis.world_prompt || analysis.prompt
  }
  throw new Error('Provide --prompt, --prompt-file, or --analysis.')
}

if (isDirectRun) {
  const args = parseArgs(process.argv.slice(2))
  if (!args.image) {
    console.error('Usage: node workflow/step3-world.js --image restored.jpg --analysis analysis.json --output workflow/output/world')
    process.exit(1)
  }
  const prompt = await readPrompt(args)
  createWorldFromImage({
    image: args.image,
    prompt,
    outputDir: args.output || 'workflow/output/world',
    displayName: args.name,
    model: args.model || process.env.WORLDLABS_MODEL || 'marble-1.1',
    wait: args.wait !== 'false',
    downloadAssets: args['download-assets'] !== 'false',
  })
    .then((result) => console.log(JSON.stringify(result.world || result.operation, null, 2)))
    .catch((error) => {
      console.error(error)
      process.exit(1)
    })
}
