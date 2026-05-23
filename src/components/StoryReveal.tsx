import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { LocationData } from '../data/locations'

gsap.registerPlugin(ScrollTrigger)

export function StoryReveal({ location }: { location: LocationData }) {
  const sectionRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.story-reveal',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: section,
            start: 'top 68%',
            once: true,
          },
        },
      )
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="story-section">
      <div className="story-shell">
        <div className="story-heading story-reveal">
          <p className="section-kicker">archive voice</p>
          <h2>听见这段时间</h2>
        </div>
        <div className="story-copy">
          {location.story.paragraphs.map((paragraph, index) => (
            <p key={paragraph} className={index === 0 ? 'story-paragraph story-paragraph--lead story-reveal' : 'story-paragraph story-reveal'}>
              {paragraph}
            </p>
          ))}
        </div>
        {location.story.highlightQuote ? (
          <blockquote className="story-quote story-reveal">{location.story.highlightQuote}</blockquote>
        ) : null}
        <div className="soundscape story-reveal">
          <div>
            <p className="section-kicker">你 听 见 的</p>
            <h3>声音环境</h3>
          </div>
          <ul>
            {location.story.soundscape.map((sound) => (
              <li key={sound}>{sound}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
