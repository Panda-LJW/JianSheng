import type { LocationData } from '../data/locations'
import type { BgmState } from '../hooks/useBgmPlayer'
import { AudioPlayer } from './AudioPlayer'

interface Props {
  location: LocationData
  bgm: BgmState
  progress: number
}

export function HeroPast({ location, bgm, progress }: Props) {
  return (
    <section className="hero-past">
      <img
        src={location.pastImage}
        alt={`${location.name}历史复原`}
        style={{ objectPosition: location.imagePosition ?? 'center center' }}
      />
      <div className="hero-past__veil" />
      <div className="hero-past__content">
        <span className="era-pill">{location.era}</span>
        <h2>{location.name}</h2>
        <p>{location.subtitle}</p>
      </div>
      <AudioPlayer bgm={bgm} progress={progress} />
    </section>
  )
}
