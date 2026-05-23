import { locations } from '../data/locations'
import { LocationCard } from '../components/LocationCard'

interface Props {
  onSelect: (id: string) => void
}

export function HomePage({ onSelect }: Props) {
  return (
    <main className="min-h-screen max-w-[100vw] overflow-x-hidden bg-[#0D0B09] text-[#E8DFD0]">
      <section className="mx-auto grid min-h-screen w-full max-w-[100vw] content-center gap-10 px-5 py-16 sm:max-w-6xl sm:px-8">
        <div className="max-w-3xl min-w-0">
          <p className="text-xs uppercase tracking-[0.36em] text-[#C69B49]">Hack the Future Tianjin</p>
          <h1 className="mt-5 font-serif text-5xl leading-none text-[#E8DFD0] sm:text-8xl">见声</h1>
          <p className="mt-5 max-w-[21rem] break-words text-base leading-8 text-[#A89A87] sm:max-w-2xl sm:text-lg">
            看见过去的样子，听见过去的声音。选择一个天津地标，向下滚动，让现状照片、历史复原图和音乐一起完成一次时光穿越。
          </p>
        </div>
        <div className="grid min-w-0 gap-4 md:grid-cols-3">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} onSelect={onSelect} />
          ))}
        </div>
      </section>
    </main>
  )
}
