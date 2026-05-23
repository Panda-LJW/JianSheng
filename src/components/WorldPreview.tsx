import { Box, ExternalLink } from 'lucide-react'
import type { LocationData } from '../data/locations'

export function WorldPreview({ location }: { location: LocationData }) {
  if (!location.world) return null

  return (
    <section id="world" className="bg-[#0D0B09] px-5 py-20 sm:px-8">
      <div className="mx-auto grid max-w-5xl gap-6">
        <div className="grid gap-3">
          <p className="text-xs uppercase tracking-[0.32em] text-[#C69B49]">world model</p>
          <h2 className="font-serif text-4xl text-[#E8DFD0]">进入 AI 生成的世界</h2>
          <p className="max-w-2xl text-sm leading-7 text-[#A89A87]">
            这一步由 World Labs / Marble API 基于复原图生成，已下载本地 pano、GLB mesh 和 SPZ splat 资产。
          </p>
        </div>

        <div className="grid overflow-hidden rounded-lg border border-[#3A2F22] bg-[#15110D] lg:grid-cols-[1.4fr_0.8fr]">
          <a href={location.world.marbleUrl} target="_blank" rel="noreferrer" className="group relative block min-h-[280px] overflow-hidden">
            <img src={location.world.pano} alt={`${location.name} Marble 360 pano`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-[#0D0B09]/85 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-md border border-[#C69B49]/50 bg-[#0D0B09]/70 px-3 py-2 text-sm text-[#E8DFD0] backdrop-blur">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              打开 Marble World
            </span>
          </a>
          <div className="grid content-between gap-5 p-5">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#C69B49]/50 text-[#C69B49]">
                <Box className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-serif text-2xl text-[#E8DFD0]">本地世界资产</h3>
              <p className="mt-2 text-sm leading-6 text-[#A89A87]">
                可用于后续接入 splat viewer、Three.js 或 Marble 录屏。
              </p>
            </div>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4 border-t border-[#2A2118] pt-3">
                <dt className="text-[#8B7D6B]">Pano</dt>
                <dd className="text-[#E8DFD0]">4608 x 2304</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#2A2118] pt-3">
                <dt className="text-[#8B7D6B]">Mesh</dt>
                <dd className="text-[#E8DFD0]">GLB</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#2A2118] pt-3">
                <dt className="text-[#8B7D6B]">Splat</dt>
                <dd className="text-[#E8DFD0]">100k / full</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
