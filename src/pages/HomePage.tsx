import { ArrowDown, Camera, Landmark } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LocationCard } from '../components/LocationCard'
import { locations } from '../data/locations'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  focusArchive?: boolean
  onSelect: (id: string) => void
  onUpload: () => void
}

export function HomePage({ focusArchive, onSelect, onUpload }: Props) {
  const archiveRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const archive = archiveRef.current
    if (!archive) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.reveal-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: archive,
            start: 'top 70%',
            once: true,
          },
        },
      )
    }, archive)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!focusArchive) return
    window.setTimeout(() => {
      archiveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 40)
  }, [focusArchive])

  return (
    <main className="app-frame home-page">
      <section className="home-hero">
        <nav className="home-nav" aria-label="主导航">
          <span>见声</span>
          <span>海河声音档案室</span>
        </nav>
        <div className="home-hero__center">
          <p className="section-kicker">time · travel · experience</p>
          <h1>见 声</h1>
          <p>看见过去的样子，听见过去的声音</p>
          <span className="gold-rule" />
          <div className="home-actions" aria-label="体验入口">
            <button type="button" className="primary-action" onClick={onUpload}>
              <Camera aria-hidden="true" />
              <span>上传照片</span>
            </button>
            <button
              type="button"
              className="secondary-action"
              onClick={() => archiveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              <Landmark aria-hidden="true" />
              <span>浏览地标</span>
            </button>
          </div>
        </div>
        <button
          type="button"
          className="home-scroll-cue"
          onClick={() => archiveRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        >
          <ArrowDown aria-hidden="true" />
          <span>浏览地标档案</span>
        </button>
      </section>

      <section ref={archiveRef} id="archive-index" className="archive-index">
        <div className="archive-index__heading">
          <p>天 津 · 时 光 档 案</p>
          <span />
        </div>
        <div className="archive-card-list">
          {locations.map((location) => (
            <LocationCard key={location.id} location={location} onSelect={onSelect} />
          ))}
        </div>
        <footer className="home-footer">Hack the Future · 天津站</footer>
      </section>
    </main>
  )
}
