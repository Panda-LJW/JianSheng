import { Pause, Play } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { BgmState } from '../hooks/useBgmPlayer'

interface Props {
  bgm: BgmState
  progress: number
}

const bars = [0.35, 0.72, 0.5, 0.92, 0.44, 0.78, 0.58, 1, 0.48, 0.82, 0.38, 0.7]

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const rest = Math.floor(seconds % 60)
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}

export function AudioPlayer({ bgm, progress }: Props) {
  const active = bgm.playing && !bgm.muted
  const duration = bgm.duration || 0
  const timeLabel = duration > 0 ? `${formatTime(bgm.currentTime)} / ${formatTime(duration)}` : '随滚动渐入'

  return (
    <div className="audio-player" style={{ '--audio-progress': progress } as CSSProperties}>
      <button
        type="button"
        className="audio-player__button"
        onClick={bgm.togglePlayback}
        aria-label={bgm.playing ? '暂停背景音乐' : '播放背景音乐'}
        title={bgm.playing ? '暂停背景音乐' : '播放背景音乐'}
      >
        {bgm.playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
      <div className="audio-player__wave" aria-hidden="true">
        {bars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={active ? 'is-active' : undefined}
            style={{ '--bar-height': height, '--bar-delay': `${index * 80}ms` } as CSSProperties}
          />
        ))}
      </div>
      <div className="audio-player__meta">
        <span>{bgm.ready ? '海河旧声' : '轻触唤醒'}</span>
        <strong>{timeLabel}</strong>
      </div>
    </div>
  )
}
