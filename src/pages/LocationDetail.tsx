import { useRef } from 'react'
import { MarbleVideo } from '../components/MarbleVideo'
import { MarbleWorldEntry } from '../components/MarbleWorldEntry'
import { MusicToggle } from '../components/MusicToggle'
import { StoryReveal } from '../components/StoryReveal'
import { TimeTransition } from '../components/TimeTransition'
import { TimelineExplorer } from '../components/TimelineExplorer'
import type { LocationData } from '../data/locations'
import { useBgmPlayer } from '../hooks/useBgmPlayer'
import { useScrollProgress } from '../hooks/useScrollProgress'

interface Props {
  location: LocationData
  onBack: () => void
  onSelectLocation: (id: string) => void
}

export function LocationDetail({ location, onBack, onSelectLocation }: Props) {
  const transitionRef = useRef<HTMLElement | null>(null)
  const progress = useScrollProgress(transitionRef)
  const bgm = useBgmPlayer(location.bgmAudio, progress)

  return (
    <main className="app-frame detail-page">
      <MusicToggle muted={bgm.muted} ready={bgm.ready} progress={progress} onToggle={bgm.toggleMuted} />
      <section ref={transitionRef} className="transition-anchor">
        <TimeTransition location={location} progress={progress} bgm={bgm} onBack={onBack} />
      </section>
      <TimelineExplorer location={location} onSelectLocation={onSelectLocation} />
      <MarbleWorldEntry location={location} />
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
