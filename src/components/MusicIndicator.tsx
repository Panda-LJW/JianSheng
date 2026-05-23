import { Volume2, VolumeX } from 'lucide-react'

interface Props {
  muted: boolean
  ready: boolean
  progress: number
  onToggle: () => void
}

export function MusicIndicator({ muted, ready, progress, onToggle }: Props) {
  const Icon = muted ? VolumeX : Volume2
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed right-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-md border border-[#C69B49]/50 bg-[#0D0B09]/75 text-[#E8DFD0] backdrop-blur transition hover:border-[#C69B49] hover:text-[#C69B49] focus:outline-none focus:ring-2 focus:ring-[#C69B49]"
      aria-label={muted ? '取消静音' : '静音'}
      title={ready ? `音乐音量 ${Math.round(progress * 100)}%` : '滚动或点击以启动音乐'}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span
        className="absolute bottom-0 left-0 h-0.5 bg-[#C69B49] transition-all"
        style={{ width: `${muted ? 0 : progress * 100}%` }}
      />
    </button>
  )
}
