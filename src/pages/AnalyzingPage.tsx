import { ArrowLeft, Check, Circle, FileJson, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { LocationData } from '../data/locations'

interface AnalyzingPageProps {
  resultLocation?: LocationData
  userPhoto?: string
  onBack: () => void
  onComplete: () => void
}

const steps = [
  { text: '读取本地照片预览', detail: '不上传到实时服务器', duration: 700 },
  { text: '匹配静态示例地标', detail: '默认命中解放桥 demo', duration: 1000 },
  { text: '载入 workflow analysis', detail: '读取离线 JSON 契约字段', duration: 1200 },
  { text: '确认历史复原图', detail: '使用已生成 restored image', duration: 1100 },
  { text: '准备音频与章节', detail: '绑定本地 BGM 与 narration', duration: 900 },
  { text: '进入可评审体验', detail: '前端 ready，不假装实时生成', duration: 900 },
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

export function AnalyzingPage({ resultLocation, userPhoto, onBack, onComplete }: AnalyzingPageProps) {
  const [elapsed, setElapsed] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
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
  }, [onComplete])

  const activeStep = getActiveStep(elapsed)
  const completedCount = Math.min(activeStep, steps.length)
  const elapsedBeforeActive = steps.slice(0, activeStep).reduce((sum, step) => sum + step.duration, 0)
  const activeStepElapsed = Math.max(0, elapsed - elapsedBeforeActive)
  const progress = Math.min(1, elapsed / totalDuration)
  const currentText = useMemo(() => {
    if (finished) return '示例结果已准备完毕'
    const current = steps[activeStep] ?? steps[steps.length - 1]
    return typedText(`正在${current.text}...`, activeStepElapsed, current.duration)
  }, [activeStep, activeStepElapsed, finished])

  return (
    <main className="app-frame analyzing-page">
      <button type="button" className="back-button upload-back" onClick={onBack} aria-label="返回上传页">
        <ArrowLeft aria-hidden="true" />
        <span>返回上传</span>
      </button>
      <section className="analyzing-page__shell">
        <div className="analysis-heading">
          <p className="section-kicker">offline workflow demo</p>
          <h1>载入已生成结果</h1>
          <p>这里展示的是离线 AI workflow 的前端契约演示，不会把照片发送到实时后端。</p>
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
          <FileJson aria-hidden="true" />
          <div>
            <strong>{resultLocation?.name ?? '解放桥'} · 契约就绪</strong>
            <span>{resultLocation?.pipeline?.analysisPath ?? 'workflow/output/demo-analyses.json'}</span>
          </div>
        </aside>
      </section>
    </main>
  )
}
