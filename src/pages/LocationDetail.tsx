import { useRef } from 'react'
import { HeroPast } from '../components/HeroPast'
import { HeroPresent } from '../components/HeroPresent'
import { MarbleVideo } from '../components/MarbleVideo'
import { MusicToggle } from '../components/MusicToggle'
import { StoryReveal } from '../components/StoryReveal'
import { TimeTransition } from '../components/TimeTransition'
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
    <main className="app-frame detail-page">
      <MusicToggle muted={bgm.muted} ready={bgm.ready} progress={progress} onToggle={bgm.toggleMuted} />
      <HeroPresent location={location} onBack={onBack} />
      <section ref={transitionRef} className="transition-anchor">
        <TimeTransition location={location} progress={progress} />
      </section>
      <HeroPast location={location} bgm={bgm} progress={progress} />
      <MarbleVideo src={location.marbleVideo} />
      <StoryReveal location={location} />

      <footer className="detail-footer">
        <span className="detail-footer__line" />
        <p>旅行不只是打卡<br />是穿越</p>
        <span className="gold-rule" />
        <strong>见 声</strong>
        <button type="button" onClick={onBack}>← 探索更多地标</button>
        <small>Hack the Future · 天津站</small>
      </footer>
    </main>
  )
}
