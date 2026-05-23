import { Check, Circle, Loader2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

interface AnalyzingPageProps {
  userPhoto?: string
  onComplete: () => void
}

const steps = [
  { text: '读取照片信息', duration: 800 },
  { text: '识别拍摄地点', duration: 1200 },
  { text: '检索历史档案', duration: 1500 },
  { text: '选择穿越年代', duration: 1000 },
  { text: '生成历史复原图', duration: 1500 },
  { text: '生成时代音乐', duration: 1000 },
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

export function AnalyzingPage({ userPhoto, onComplete }: AnalyzingPageProps) {
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
    if (finished) return '穿越准备完毕'
    const current = steps[activeStep] ?? steps[steps.length - 1]
    return typedText(`正在${current.text}...`, activeStepElapsed, current.duration)
  }, [activeStep, activeStepElapsed, finished])

  return (
    <main className="app-frame analyzing-page">
      <style>{`
        .analyzing-page {
          min-height: 100dvh;
          background:
            radial-gradient(circle at 50% 12%, rgba(198, 155, 73, 0.1), transparent 18rem),
            linear-gradient(180deg, var(--bg-primary), var(--bg-deep) 68%);
        }

        .analyzing-page__shell {
          display: grid;
          min-height: 100dvh;
          align-content: center;
          gap: 30px;
          padding: 28px 18px;
        }

        .analysis-photo {
          position: relative;
          width: min(100%, 220px);
          aspect-ratio: 4 / 3;
          justify-self: center;
          overflow: hidden;
          border: 1px solid var(--border-medium);
          border-radius: 8px;
          background: var(--bg-secondary);
          box-shadow: 0 0 34px rgba(198, 155, 73, 0.13);
        }

        .analysis-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.88) sepia(0.12) brightness(0.86);
        }

        .analysis-photo__scan {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(198, 155, 73, 0.24) 50%, transparent 100%);
          transform: translateY(-100%);
          animation: analysis-scan 2.2s ease-in-out infinite;
        }

        .analysis-progress {
          display: grid;
          gap: 16px;
          text-align: center;
        }

        .analysis-progress__rail {
          position: relative;
          height: 2px;
          overflow: hidden;
          border-radius: 999px;
          background: var(--bg-elevated);
        }

        .analysis-progress__bar {
          position: absolute;
          inset: 0;
          transform-origin: left;
          background: var(--accent-gold);
          box-shadow: 0 0 16px var(--glow-gold);
          transition: transform 120ms linear;
        }

        .analysis-progress p {
          min-height: 32px;
          margin: 0;
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 2;
        }

        .analysis-steps {
          display: grid;
          gap: 12px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .analysis-steps li {
          display: flex;
          min-height: 32px;
          align-items: center;
          gap: 11px;
          color: var(--text-dim);
          font-size: 0.92rem;
          transition: color 240ms ease, opacity 240ms ease;
        }

        .analysis-step-icon {
          display: grid;
          width: 22px;
          height: 22px;
          place-items: center;
          color: currentColor;
        }

        .analysis-step-icon svg {
          width: 17px;
          height: 17px;
        }

        .analysis-steps li.is-active,
        .analysis-steps li.is-done {
          color: var(--accent-gold);
        }

        .analysis-steps li.is-active .analysis-step-icon {
          animation: analysis-pulse 1s ease-in-out infinite;
        }

        .analysis-steps li.is-active .analysis-step-icon svg {
          animation: analysis-spin 1.3s linear infinite;
        }

        @keyframes analysis-scan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20%,
          80% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes analysis-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.74;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        @keyframes analysis-spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <section className="analyzing-page__shell">
        <div className="analysis-photo">
          <img src={userPhoto || '/images/jiefang_present.jpg'} alt={userPhoto ? '用户上传照片' : '天津示例照片'} />
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
                <span>{step.text}</span>
              </li>
            )
          })}
        </ol>
      </section>
    </main>
  )
}
