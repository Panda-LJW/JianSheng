import { ArrowDown, ArrowLeft } from 'lucide-react'
import type { LocationData } from '../data/locations'
import type { BgmState } from '../hooks/useBgmPlayer'
import { AudioPlayer } from './AudioPlayer'

interface Props {
  location: LocationData
  progress: number
  bgm: BgmState
  onBack: () => void
}

export function TimeTransition({ location, progress, bgm, onBack }: Props) {
  const historicalFrames = [...(location.timelines ?? [])].reverse()
  const frames = [
    {
      id: `${location.id}-present`,
      yearLabel: String(location.presentYear),
      eraLabel: '现代',
      image: location.presentImage,
      title: '今天的现场',
    },
    ...historicalFrames.map((item) => ({
      id: item.id,
      yearLabel: item.yearLabel,
      eraLabel: item.eraLabel,
      image: item.image,
      title: item.title,
    })),
  ]
  const totalFrames = Math.max(1, frames.length)
  const presentHold = 2.5
  const frameHold = 2.5
  const crossfade = 2
  const finalHold = 3
  const timelineDuration =
    totalFrames <= 1
      ? finalHold
      : presentHold + crossfade + Math.max(0, totalFrames - 2) * (frameHold + crossfade) + finalHold
  const elapsed = Math.min(timelineDuration, Math.max(0, progress) * timelineDuration)
  let cursor = 0
  let activeIndex = totalFrames - 1
  let nextIndex = totalFrames - 1
  let fadeProgress = 0
  let phase: 'hold' | 'fade' | 'final' = 'final'

  for (let index = 0; index < totalFrames - 1; index += 1) {
    const holdDuration = index === 0 ? presentHold : frameHold
    if (elapsed < cursor + holdDuration) {
      activeIndex = index
      nextIndex = index
      phase = 'hold'
      fadeProgress = 0
      break
    }

    cursor += holdDuration
    if (elapsed < cursor + crossfade) {
      activeIndex = index
      nextIndex = index + 1
      phase = 'fade'
      fadeProgress = (elapsed - cursor) / crossfade
      break
    }

    cursor += crossfade
  }

  const labelFrame = phase === 'fade' && fadeProgress > 0.56
    ? frames[nextIndex] ?? frames[activeIndex] ?? frames[0]
    : frames[activeIndex] ?? frames[0]
  const activeFrame = labelFrame
  const isLastFrame = activeIndex >= totalFrames - 1
  const transitionTarget = frames[Math.min(totalFrames - 1, nextIndex)]
  const upcomingFrame = frames[Math.min(totalFrames - 1, activeIndex + 1)]
  const isOpening = activeFrame.id === `${location.id}-present` && phase === 'hold'
  const statusLine = phase === 'fade' && transitionTarget
    ? activeIndex === 0
      ? '图像渐渐模糊 · 声音渐渐清晰'
      : `影像切换 · ${transitionTarget.yearLabel} ${transitionTarget.eraLabel}`
    : isLastFrame || phase === 'final'
      ? '历史图像定格'
      : `下一帧 · ${upcomingFrame.yearLabel} ${upcomingFrame.eraLabel}`

  return (
    <section className="time-transition" aria-label={`${location.name}时光过渡`}>
      <div className="time-transition__sticky">
        <button type="button" className="back-button time-transition__back" onClick={onBack} aria-label="返回档案室">
          <ArrowLeft aria-hidden="true" />
          <span>返回档案室</span>
        </button>
        {frames.map((frame, index) => {
          const opacity = phase === 'fade'
            ? index === activeIndex
              ? 1 - fadeProgress
              : index === nextIndex
                ? fadeProgress
                : 0
            : index === activeIndex
              ? 1
              : 0
          const scale = phase === 'fade' && (index === activeIndex || index === nextIndex)
            ? 1.03 - Math.abs(0.5 - fadeProgress) * 0.02
            : 1.01
          return (
            <img
              key={frame.id}
              src={frame.image}
              alt={`${location.name}${frame.yearLabel}${frame.title}`}
              className="time-transition__image"
              style={{
                opacity,
                transform: `scale(${scale})`,
                objectPosition: location.imagePosition ?? 'center center',
              }}
            />
          )
        })}
        <div className="time-transition__shade" />
        <div className="time-transition__progress" style={{ transform: `scaleX(${progress})` }} />
        <div className={isOpening ? 'time-transition__intro is-active' : 'time-transition__intro'}>
          <p className="section-kicker">time · travel</p>
          <h1>{location.name}</h1>
          <p>{location.subtitle}</p>
          <p>{location.archiveNote}</p>
          <div className="scroll-cue">
            <span>向下滑动，穿越时光</span>
            <ArrowDown aria-hidden="true" />
          </div>
        </div>
        <div className={isOpening ? 'time-transition__center' : 'time-transition__center is-active'}>
          <div className="time-transition__line" />
          <p className="section-kicker">scroll progress</p>
          <strong>{activeFrame.yearLabel}</strong>
          <span>{activeFrame.eraLabel}</span>
          <p>{activeFrame.title}</p>
          <p>{statusLine}</p>
        </div>
        <AudioPlayer bgm={bgm} progress={progress} />
      </div>
    </section>
  )
}
