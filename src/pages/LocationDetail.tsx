import { ArrowDown, ArrowLeft } from 'lucide-react'
import { useRef } from 'react'
import { MarbleVideo } from '../components/MarbleVideo'
import { MusicIndicator } from '../components/MusicIndicator'
import { StoryReveal } from '../components/StoryReveal'
import { TimeTransition } from '../components/TimeTransition'
import { WorldPreview } from '../components/WorldPreview'
import type { LocationData } from '../data/locations'
import { useBgmPlayer } from '../hooks/useBgmPlayer'
import { useScrollProgress } from '../hooks/useScrollProgress'

interface Props {
  location: LocationData
  onBack: () => void
}

export function LocationDetail({ location, onBack }: Props) {
  const transitionRef = useRef<HTMLElement | null>(null)
  const progress = useScrollProgress(transitionRef)
  const bgm = useBgmPlayer(location.bgmAudio, progress)

  return (
    <main className="min-h-screen bg-[#0D0B09] text-[#E8DFD0]">
      <button
        type="button"
        onClick={onBack}
        className="fixed left-4 top-4 z-40 flex h-11 w-11 items-center justify-center rounded-md border border-[#C69B49]/50 bg-[#0D0B09]/75 text-[#E8DFD0] backdrop-blur transition hover:border-[#C69B49] hover:text-[#C69B49] focus:outline-none focus:ring-2 focus:ring-[#C69B49]"
        aria-label="返回首页"
        title="返回首页"
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <MusicIndicator muted={bgm.muted} ready={bgm.ready} progress={progress} onToggle={bgm.toggleMuted} />

      <section className="relative h-screen overflow-hidden">
        <img src={location.presentImage} alt={`${location.name}现状`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B09]/25 via-[#0D0B09]/25 to-[#0D0B09]/90" />
        <div className="absolute inset-x-5 bottom-12 mx-auto max-w-5xl sm:bottom-16">
          <p className="text-xs uppercase tracking-[0.32em] text-[#C69B49]">{location.subtitle}</p>
          <h1 className="mt-4 font-serif text-5xl leading-none text-[#E8DFD0] sm:text-7xl">{location.name}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#A89A87]">{location.era} · {location.musicStyle}</p>
          <div className="mt-8 flex items-center gap-3 text-sm text-[#E8DFD0]">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-[#C69B49]/50">
              <ArrowDown className="h-5 w-5 animate-bounce" aria-hidden="true" />
            </span>
            向下滑动，穿越时光
          </div>
        </div>
      </section>

      <section ref={transitionRef}>
        <TimeTransition location={location} progress={progress} />
      </section>

      <section className="relative h-screen overflow-hidden">
        <img src={location.pastImage} alt={`${location.name}历史复原`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B09]/10 via-[#0D0B09]/10 to-[#0D0B09]/80" />
        <div className="absolute inset-x-5 bottom-12 mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.32em] text-[#C69B49]">restored scene</p>
          <h2 className="mt-3 font-serif text-4xl text-[#E8DFD0] sm:text-6xl">{location.era}</h2>
        </div>
      </section>

      <WorldPreview location={location} />
      <MarbleVideo src={location.marbleVideo} />
      <StoryReveal location={location} />

      <section className="bg-[#0D0B09] px-5 pb-20 text-center">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-[#C69B49]/60 px-5 py-3 text-sm text-[#E8DFD0] transition hover:border-[#C69B49] hover:text-[#C69B49] focus:outline-none focus:ring-2 focus:ring-[#C69B49]"
        >
          返回首页
        </button>
      </section>
    </main>
  )
}
