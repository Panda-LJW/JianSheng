import { ArrowRight } from 'lucide-react'
import type { LocationData } from '../data/locations'

interface Props {
  location: LocationData
  onSelect: (id: string) => void
}

export function LocationCard({ location, onSelect }: Props) {
  return (
    <button
      className="archive-card reveal-card group"
      onClick={() => onSelect(location.id)}
      type="button"
    >
      <span className="archive-card__image">
        <img
          src={location.presentImage}
          alt={`${location.name}现状`}
          style={{ objectPosition: location.imagePosition ?? 'center center' }}
        />
        <span className="archive-card__glow" />
      </span>
      <span className="archive-card__body">
        <span className="archive-card__title-row">
          <span className="archive-card__title">{location.name}</span>
          <span className="archive-card__era">{location.era}</span>
        </span>
        <span className="archive-card__subtitle">{location.subtitle}</span>
        <span className="archive-card__note">{location.archiveNote}</span>
        <span className="archive-card__arrow" aria-hidden="true">
          <ArrowRight />
        </span>
      </span>
    </button>
  )
}
