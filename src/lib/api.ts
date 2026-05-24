export type JobStatus =
  | 'queued'
  | 'analyzing'
  | 'researching'
  | 'restoring'
  | 'narrating'
  | 'worlding'
  | 'completed'
  | 'failed'

export interface ExperienceJob {
  id: string
  status: JobStatus
  progress: number
  label: string
  resultId: string
  createdAt: string
  updatedAt: string
  steps: {
    status: JobStatus
    label: string
    completed: boolean
  }[]
  error?: string
}

export interface ApiHealth {
  ok: boolean
  service: string
  capabilities: {
    jobs: boolean
    tts: boolean
    research: boolean
    workflow: boolean
    marble: boolean
  }
  models: {
    tts: string
    voice: string
    research: string
    webSearchTool: string
  }
}

const API_BASE = import.meta.env.VITE_JIANSHENG_API_URL || 'http://localhost:8787'

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `API request failed: ${response.status}`)
  }
  return payload as T
}

export async function getApiHealth() {
  return requestJson<ApiHealth>('/api/health')
}

export async function createExperienceJob(input: { resultId: string; source: string; filename?: string }) {
  const payload = await requestJson<{ job: ExperienceJob }>('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return payload.job
}

export async function getExperienceJob(jobId: string) {
  const payload = await requestJson<{ job: ExperienceJob }>(`/api/jobs/${encodeURIComponent(jobId)}`)
  return payload.job
}

export async function generateTtsAudio(input: { text: string; voice?: string; speed?: number }) {
  const response = await fetch(`${API_BASE}/api/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.message || payload.error || `TTS request failed: ${response.status}`)
  }
  return URL.createObjectURL(await response.blob())
}
