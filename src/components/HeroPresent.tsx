import { ArrowDown, ArrowLeft } from 'lucide-react'
import type { LocationData } from '../data/locations'

interface Props {
  location: LocationData
  onBack: () => void
}

export function HeroPresent({ location, onBack }: Props) {
  return (
    <section className="hero-present">
      <img
        src={location.presentImage}
        alt={`${location.name}现状`}
        style={{ objectPosition: location.imagePosition ?? 'center center' }}
      />
      <div className="hero-present__veil" />
      <button type="button" className="back-button" onClick={onBack} aria-label="返回档案室">
        <ArrowLeft aria-hidden="true" />
        <span>返回档案室</span>
      </button>
      <div className="hero-present__content">
        <p className="section-kicker">time · travel</p>
        <h1>{location.name}</h1>
        <p>{location.subtitle}</p>
        <p>{location.archiveNote}</p>
        <div className="scroll-cue">
          <span>向下滑动，穿越时光</span>
          <ArrowDown aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
