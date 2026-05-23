import type { LocationData } from '../data/locations'

interface Props {
  location: LocationData
  progress: number
}

export function TimeTransition({ location, progress }: Props) {
  const presentOpacity = Math.max(0, 1 - progress * 1.25)
  const pastOpacity = Math.min(1, Math.max(0, (progress - 0.12) * 1.35))
  const yearOpacity = Math.min(1, Math.max(0, (progress - 0.08) * 2))

  return (
    <section className="relative h-[300vh]" aria-label={`${location.name}时光过渡`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <img
          src={location.presentImage}
          alt={`${location.name}现状`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: presentOpacity }}
        />
        <img
          src={location.pastImage}
          alt={`${location.name}历史复原`}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: pastOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0B09]/20 via-[#0D0B09]/20 to-[#0D0B09]/85" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-[#C69B49]/25">
          <span
            className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C69B49]/60 bg-[#0D0B09]/75 backdrop-blur"
            style={{ transform: `translate(-50%, -50%) scale(${0.75 + progress * 0.35})` }}
          />
        </div>
        <div className="absolute inset-x-4 top-1/2 mx-auto grid max-w-3xl -translate-y-1/2 place-items-center text-center">
          <p className="text-xs uppercase tracking-[0.32em] text-[#C69B49]">scroll to cross time</p>
          <h2
            className="mt-4 font-serif text-5xl leading-tight text-[#E8DFD0] sm:text-7xl"
            style={{ opacity: yearOpacity }}
          >
            {location.era}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#A89A87] sm:text-base">
            现状影像随滚动隐去，历史复原图与音乐一起浮现。
          </p>
        </div>
      </div>
    </section>
  )
}
