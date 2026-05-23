import { Volume2, VolumeX } from 'lucide-react'
import type { CSSProperties } from 'react'

interface Props {
  muted: boolean
  ready: boolean
  progress: number
  onToggle: () => void
}

export function MusicToggle({ muted, ready, progress, onToggle }: Props) {
  const Icon = muted ? VolumeX : Volume2

  return (
    <button
      type="button"
      className="music-toggle"
      onClick={onToggle}
      aria-label={muted ? '打开音乐' : '关闭音乐'}
      title={muted ? '打开音乐' : '关闭音乐'}
      style={{ '--audio-progress': progress } as CSSProperties}
    >
      <span className="music-toggle__ring" />
      <Icon aria-hidden="true" />
      <span className="music-toggle__dot" data-ready={ready} />
    </button>
  )
}
