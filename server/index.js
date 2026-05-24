import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import OpenAI from 'openai'

loadEnvFile()

const PORT = Number(process.env.JIANSHENG_API_PORT || 8787)
const OPENAI_CONFIGURED = Boolean(process.env.OPENAI_API_KEY)
const TTS_MODEL = process.env.JIANSHENG_TTS_MODEL || 'gpt-4o-mini-tts'
const TTS_VOICE = process.env.JIANSHENG_TTS_VOICE || 'verse'
const RESEARCH_MODEL = process.env.JIANSHENG_RESEARCH_MODEL || 'gpt-4.1-mini'
const WEB_SEARCH_TOOL = process.env.JIANSHENG_WEB_SEARCH_TOOL || 'web_search'
const JOB_STEPS = [
  ['queued', '任务已创建'],
  ['analyzing', '识别地点与时代线索'],
  ['researching', '检索历史资料线索'],
  ['restoring', '准备历史复原图与热点'],
  ['narrating', '准备章节旁白与 TTS'],
  ['worlding', '检查 Marble / 3D 场景入口'],
  ['completed', '体验结果已就绪'],
]
const jobs = new Map()

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

function createOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  })
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': 'application/json; charset=utf-8',
  })
  response.end(JSON.stringify(payload))
}

function sendBuffer(response, status, buffer, contentType, headers = {}) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Content-Type': contentType,
    ...headers,
  })
  response.end(buffer)
}

function notFound(response) {
  sendJson(response, 404, { error: 'not_found' })
}

async function readJson(request) {
  const chunks = []
  for await (const chunk of request) chunks.push(chunk)
  if (!chunks.length) return {}
  const raw = Buffer.concat(chunks).toString('utf8')
  try {
    return JSON.parse(raw)
  } catch {
    const error = new Error('Request body must be valid JSON.')
    error.status = 400
    throw error
  }
}

function publicJob(job) {
  return {
    id: job.id,
    status: job.status,
    progress: job.progress,
    label: job.label,
    resultId: job.resultId,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
    steps: job.steps,
    error: job.error,
  }
}

function createJob({ resultId = 'jiefang', source = 'upload', filename }) {
  const now = new Date().toISOString()
  const job = {
    id: randomUUID(),
    resultId,
    source,
    filename,
    status: 'queued',
    progress: 0,
    label: JOB_STEPS[0][1],
    createdAt: now,
    updatedAt: now,
    steps: JOB_STEPS.map(([status, label], index) => ({
      status,
      label,
      completed: index === 0,
    })),
  }
  jobs.set(job.id, job)
  advanceDemoJob(job.id)
  return job
}

function advanceDemoJob(jobId) {
  JOB_STEPS.forEach(([status, label], index) => {
    windowlessTimeout(() => {
      const job = jobs.get(jobId)
      if (!job || job.status === 'failed') return
      const lastIndex = JOB_STEPS.length - 1
      job.status = status
      job.label = label
      job.progress = index / lastIndex
      job.updatedAt = new Date().toISOString()
      job.steps = job.steps.map((step, stepIndex) => ({
        ...step,
        completed: stepIndex <= index,
      }))
    }, index * 680)
  })
}

function windowlessTimeout(callback, delay) {
  setTimeout(callback, delay)
}

async function handleHealth(response) {
  sendJson(response, 200, {
    ok: true,
    service: 'jiansheng-api',
    version: 'uiux002-local',
    capabilities: {
      jobs: true,
      tts: OPENAI_CONFIGURED,
      research: OPENAI_CONFIGURED,
      workflow: true,
      marble: Boolean(process.env.WORLDLABS_API_KEY),
    },
    models: {
      tts: TTS_MODEL,
      voice: TTS_VOICE,
      research: RESEARCH_MODEL,
      webSearchTool: WEB_SEARCH_TOOL,
    },
  })
}

async function handleCreateJob(request, response) {
  const body = await readJson(request)
  const job = createJob({
    resultId: body.resultId || 'jiefang',
    source: body.source || 'upload',
    filename: body.filename,
  })
  sendJson(response, 201, { job: publicJob(job) })
}

async function handleGetJob(response, jobId) {
  const job = jobs.get(jobId)
  if (!job) {
    notFound(response)
    return
  }
  sendJson(response, 200, { job: publicJob(job) })
}

async function handleTts(request, response) {
  if (!OPENAI_CONFIGURED) {
    sendJson(response, 503, {
      error: 'not_configured',
      message: 'Set OPENAI_API_KEY to generate TTS audio.',
    })
    return
  }

  const body = await readJson(request)
  const input = String(body.text || '').trim()
  if (!input) {
    sendJson(response, 400, { error: 'missing_text' })
    return
  }

  const client = createOpenAIClient()
  const speech = await client.audio.speech.create({
    model: body.model || TTS_MODEL,
    voice: body.voice || TTS_VOICE,
    input: input.slice(0, 4096),
    instructions: body.instructions || '用温和、沉浸、像文旅纪录片旁白一样的中文语气朗读，节奏舒缓但不要拖沓。',
    response_format: 'mp3',
    speed: Number(body.speed || 0.96),
  })
  const buffer = Buffer.from(await speech.arrayBuffer())

  if (body.persist === true) {
    const fileName = `${Date.now()}-${randomUUID()}.mp3`
    const outputDir = path.resolve('server/output/tts')
    await mkdir(outputDir, { recursive: true })
    await writeFile(path.join(outputDir, fileName), buffer)
  }

  sendBuffer(response, 200, buffer, 'audio/mpeg', {
    'Cache-Control': 'no-store',
    'Content-Disposition': 'inline; filename="jiansheng-tts.mp3"',
  })
}

async function handleResearch(request, response) {
  if (!OPENAI_CONFIGURED) {
    sendJson(response, 503, {
      error: 'not_configured',
      message: 'Set OPENAI_API_KEY to use Web Search research.',
    })
    return
  }

  const body = await readJson(request)
  const place = String(body.place || body.query || '').trim()
  if (!place) {
    sendJson(response, 400, { error: 'missing_query' })
    return
  }

  try {
    const client = createOpenAIClient()
    const responseFromModel = await client.responses.create({
      model: body.model || RESEARCH_MODEL,
      input: [
        '你是“见声”项目的文旅资料研究员。',
        `请检索并总结 ${place} 的历史资料，重点关注：年代、空间功能、人物活动、声音环境、可用于历史复原图的视觉细节。`,
        '输出简洁中文，包含：1) 核心事实 2) 可视化细节 3) 声音线索 4) 仍需人工确认的问题。',
      ].join('\n'),
      tools: [
        {
          type: WEB_SEARCH_TOOL,
          search_context_size: body.searchContextSize || 'medium',
          user_location: {
            type: 'approximate',
            country: 'CN',
            region: 'Tianjin',
            city: 'Tianjin',
            timezone: 'Asia/Shanghai',
          },
        },
      ],
      include: ['web_search_call.action.sources'],
    })

    sendJson(response, 200, {
      query: place,
      model: responseFromModel.model,
      summary: responseFromModel.output_text,
      sources: extractSources(responseFromModel),
    })
  } catch (error) {
    sendJson(response, error.status || 502, {
      error: 'upstream_unavailable',
      message: error.message || 'Web Search is temporarily unavailable.',
      fallback: {
        document: 'docs/tianjin-landmark-historical-research.md',
        note: 'Use the local research document as the current source of truth, then retry Web Search later.',
      },
    })
  }
}

function extractSources(modelResponse) {
  const sources = []
  for (const item of modelResponse.output || []) {
    if (item.type === 'web_search_call' && item.action?.sources) {
      for (const source of item.action.sources) sources.push({ url: source.url })
    }
    if (item.type === 'message') {
      for (const content of item.content || []) {
        if (content.type !== 'output_text') continue
        for (const annotation of content.annotations || []) {
          if (annotation.type === 'url_citation') {
            sources.push({ title: annotation.title, url: annotation.url })
          }
        }
      }
    }
  }
  return Array.from(new Map(sources.map((source) => [source.url, source])).values())
}

async function route(request, response) {
  const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)

  if (request.method === 'OPTIONS') {
    sendJson(response, 204, {})
    return
  }

  try {
    if (request.method === 'GET' && url.pathname === '/api/health') {
      await handleHealth(response)
      return
    }
    if (request.method === 'POST' && url.pathname === '/api/jobs') {
      await handleCreateJob(request, response)
      return
    }
    if (request.method === 'GET' && url.pathname.startsWith('/api/jobs/')) {
      await handleGetJob(response, decodeURIComponent(url.pathname.replace('/api/jobs/', '')))
      return
    }
    if (request.method === 'POST' && url.pathname === '/api/tts') {
      await handleTts(request, response)
      return
    }
    if (request.method === 'POST' && url.pathname === '/api/research') {
      await handleResearch(request, response)
      return
    }
    notFound(response)
  } catch (error) {
    console.error(error)
    sendJson(response, error.status || 500, {
      error: error.code || 'server_error',
      message: error.message || 'Unknown server error.',
    })
  }
}

createServer(route).listen(PORT, () => {
  console.log(`JianSheng API listening on http://localhost:${PORT}`)
})
