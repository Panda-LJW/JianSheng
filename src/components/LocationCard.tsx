import { ArrowRight } from 'lucide-react'
import type { LocationData } from '../data/locations'

interface Props {
  location: LocationData
  onSelect: (id: string) => void
}

export function LocationCard({ location, onSelect }: Props) {
  return (
    <button
      className="group grid w-full min-w-0 overflow-hidden rounded-lg border border-[#3A2F22] bg-[#15110D] text-left transition duration-300 hover:-translate-y-1 hover:border-[#C69B49]/70 focus:outline-none focus:ring-2 focus:ring-[#C69B49]"
      onClick={() => onSelect(location.id)}
      type="button"
    >
      <span className="relative block aspect-[4/3] overflow-hidden">
        <img
          src={location.presentImage}
          alt={`${location.name}现状`}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-[#0D0B09] via-[#0D0B09]/15 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-md border border-[#C69B49]/40 bg-[#0D0B09]/70 px-2.5 py-1 text-xs text-[#E8DFD0] backdrop-blur">
          {location.era}
        </span>
      </span>
      <span className="grid min-w-0 gap-3 p-4">
        <span>
          <span className="block font-serif text-2xl text-[#E8DFD0]">{location.name}</span>
          <span className="mt-1 block text-sm text-[#A89A87]">{location.subtitle}</span>
        </span>
        <span className="flex items-center justify-between border-t border-[#2A2118] pt-3 text-sm text-[#C69B49]">
          进入时光卷轴
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
        </span>
      </span>
    </button>
  )
}
