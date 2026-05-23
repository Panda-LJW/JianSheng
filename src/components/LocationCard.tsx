import { ArrowRight } from 'lucide-react'
import type { LocationData } from '../data/locations'

interface Props {
  location: LocationData
  onSelect: (id: string) => void
}

export function LocationCard({ location, onSelect }: Props) {
  return (
    <button
      className="card-enter group grid w-full min-w-0 overflow-hidden rounded-xl border border-[#3A2F22] bg-[#15110D] text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[#C69B49]/70 hover:shadow-[0_8px_32px_rgba(198,155,73,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69B49] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0B09]"
      onClick={() => onSelect(location.id)}
      type="button"
    >
      {/* Image */}
      <span className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={location.presentImage}
          alt={`${location.name}现状`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <span className="absolute inset-0 bg-gradient-to-t from-[#0D0B09] via-[#0D0B09]/20 to-transparent" />
        {/* Era badge */}
        <span className="absolute bottom-3 left-3 rounded-md border border-[#C69B49]/40 bg-[#0D0B09]/75 px-2.5 py-1 text-xs font-medium text-[#E8DFD0] backdrop-blur-sm tracking-wide">
          {location.era}
        </span>
      </span>

      {/* Content */}
      <span className="grid min-w-0 gap-3 p-5">
        <span>
          <span className="block font-serif text-2xl leading-snug text-[#E8DFD0] transition-colors duration-200 group-hover:text-white">
            {location.name}
          </span>
          <span className="mt-1.5 block text-sm leading-relaxed text-[#A89A87]">
            {location.subtitle}
          </span>
        </span>
        <span className="flex items-center justify-between border-t border-[#2A2118] pt-3 text-sm text-[#C69B49]">
          <span className="tracking-wide">进入时光卷轴</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </span>
    </button>
  )
}
