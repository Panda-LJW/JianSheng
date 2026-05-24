import { ArrowLeft, Check, Circle, FileJson, Loader2, Server } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { LocationData } from '../data/locations'
import { createExperienceJob, getExperienceJob, type ExperienceJob } from '../lib/api'

interface AnalyzingPageProps {
  resultLocation?: LocationData
  userPhoto?: string
  source: 'upload' | 'example'
  filename?: string
  onBack: () => void
  onComplete: () => void
}

const steps = [
  { text: '创建体验任务', detail: '连接本地 job 状态模型', duration: 700 },
  { text: '识别地点线索', detail: '默认匹配解放桥示例结果', duration: 1000 },
  { text: '检索历史资料', detail: 'Web Search 可增强资料依据', duration: 1100 },
  { text: '准备历史复原图', detail: '载入 workflow restored image', duration: 1100 },
  { text: '生成章节旁白', detail: 'TTS 接口可生成分段音频', duration: 900 },
  { text: '检查 3D 场景', detail: '读取 Marble world manifest', duration: 900 },
  { text: '进入体验结果', detail: '前端与后端契约已对齐', duration: 700 },
]

const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0)

function getActiveStep(elapsed: number) {
  let accumulated = 0
  for (let index = 0; index < steps.length; index += 1) {
    accumulated += steps[index].duration
    if (elapsed < accumulated) return index
  }
  return steps.length
}

function typedText(text: string, elapsedInStep: number, duration: number) {
  const safeLength = Math.max(1, text.length)
  const visibleCount = Math.min(safeLength, Math.ceil((elapsedInStep / Math.max(1, duration * 0.72)) * safeLength))
  return text.slice(0, visibleCount)
}

function getStepIndexFromJob(job?: ExperienceJob | null) {
  if (!job) return -1
  return Math.max(0, job.steps.findLastIndex((step) => step.completed))
}

export function AnalyzingPage({
  resultLocation,
  userPhoto,
  source,
  filename,
  onBack,
  onComplete,
}: AnalyzingPageProps) {
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)
  const [job, setJob] = useState<ExperienceJob | null>(null)
  const [apiMode, setApiMode] = useState<'connecting' | 'connected' | 'fallback'>('connecting')

  useEffect(() => {
    let cancelled = false
    let timer = 0

    async function startJob() {
      try {
        const created = await createExperienceJob({
          resultId: resultLocation?.id ?? 'jiefang',
          source,
          filename,
        })
        if (cancelled) return
        setJob(created)
        setApiMode('connected')

        const poll = async () => {
          try {
            const next = await getExperienceJob(created.id)
            if (cancelled) return
            setJob(next)
            if (next.status === 'completed') {
              setFinished(true)
              window.setTimeout(onComplete, 520)
              return
            }
            timer = window.setTimeout(poll, 560)
          } catch {
            if (!cancelled) setApiMode('fallback')
          }
        }
        timer = window.setTimeout(poll, 460)
      } catch {
        if (!cancelled) setApiMode('fallback')
      }
    }

    void startJob()
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [filename, onComplete, resultLocation?.id, source])

  useEffect(() => {
    if (apiMode === 'connected') return undefined
    const startedAt = performance.now()
    let frame = 0

    function tick(now: number) {
      const nextElapsed = Math.min(totalDuration, now - startedAt)
      setElapsed(nextElapsed)
      if (nextElapsed < totalDuration) {
        frame = window.requestAnimationFrame(tick)
        return
      }
      setFinished(true)
      window.setTimeout(onComplete, 500)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [apiMode, onComplete])

  const fallbackStep = getActiveStep(elapsed)
  const jobStep = getStepIndexFromJob(job)
  const activeStep = apiMode === 'connected' && job ? Math.min(steps.length - 1, jobStep) : fallbackStep
  const completedCount = apiMode === 'connected' && job ? Math.min(jobStep + 1, steps.length) : Math.min(activeStep, steps.length)
  const elapsedBeforeActive = steps.slice(0, activeStep).reduce((sum, step) => sum + step.duration, 0)
  const activeStepElapsed = Math.max(0, elapsed - elapsedBeforeActive)
  const progress = apiMode === 'connected' && job ? job.progress : Math.min(1, elapsed / totalDuration)
  const currentText = useMemo(() => {
    if (finished) return '示例结果已准备完毕'
    if (apiMode === 'connected' && job) return job.label
    const current = steps[activeStep] ?? steps[steps.length - 1]
    return typedText(`正在${current.text}...`, activeStepElapsed, current.duration)
  }, [activeStep, activeStepElapsed, apiMode, finished, job])

  return (
    <main className="app-frame analyzing-page">
      <button type="button" className="back-button upload-back" onClick={onBack} aria-label="返回上传页">
        <ArrowLeft aria-hidden="true" />
        <span>返回上传</span>
      </button>
      <section className="analyzing-page__shell">
        <div className="analysis-heading">
          <p className="section-kicker">ai workflow job</p>
          <h1>生成体验任务</h1>
          <p>正在把照片入口、资料检索、复原图、TTS 与 Marble 场景整理成一次可播放的文旅体验。</p>
        </div>

        <div className="analysis-photo">
          <img src={userPhoto || resultLocation?.presentImage || '/images/jiefang_present.jpg'} alt={userPhoto ? '用户上传照片预览' : '天津示例照片'} />
          <span className="analysis-photo__scan" />
        </div>

        <div className="analysis-progress" aria-label="AI分析进度">
          <span className="analysis-progress__rail">
            <span className="analysis-progress__bar" style={{ transform: `scaleX(${progress})` }} />
          </span>
          <p>{currentText}</p>
        </div>

        <ol className="analysis-steps">
          {steps.map((step, index) => {
            const done = index < completedCount || finished
            const active = index === activeStep && !finished
            return (
              <li key={step.text} className={done ? 'is-done' : active ? 'is-active' : undefined}>
                <span className="analysis-step-icon" aria-hidden="true">
                  {done ? <Check /> : active ? <Loader2 /> : <Circle />}
                </span>
                <span>
                  <strong>{step.text}</strong>
                  <small>{step.detail}</small>
                </span>
              </li>
            )
          })}
        </ol>

        <aside className="pipeline-card" aria-label="workflow契约状态">
          {apiMode === 'connected' ? <Server aria-hidden="true" /> : <FileJson aria-hidden="true" />}
          <div>
            <strong>{resultLocation?.name ?? '解放桥'} · {apiMode === 'connected' ? '本地 API 已连接' : '本地体验流程'}</strong>
            <span>{job?.id ?? resultLocation?.pipeline?.analysisPath ?? 'workflow/output/demo-analyses.json'}</span>
          </div>
        </aside>
      </section>
    </main>
  )
}
