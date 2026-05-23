import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { LocationData } from '../data/locations'

gsap.registerPlugin(ScrollTrigger)

export function StoryReveal({ location }: { location: LocationData }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [chapterState, setChapterState] = useState({ locationId: location.id, index: 0 })
  const chapters = location.narration?.chapters ?? []
  const activeChapter = chapterState.locationId === location.id ? chapterState.index : 0
  const active = chapters[activeChapter]

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
          {location.narration ? (
            <p>约 {location.narration.estimatedMinutes} 分钟的章节式旁白，为未来 TTS 播放预留内容密度。</p>
          ) : null}
        </div>
        {location.narration && active ? (
          <div className="narration-panel story-reveal">
            <div className="chapter-rail" aria-label="旁白章节">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.id}
                  type="button"
                  className={index === activeChapter ? 'is-active' : undefined}
                  aria-pressed={index === activeChapter}
                  onClick={() => setChapterState({ locationId: location.id, index })}
                >
                  <span>{chapter.durationLabel}</span>
                  <strong>{chapter.title}</strong>
                </button>
              ))}
            </div>

            <div className="chapter-carousel" aria-live="polite">
              <article className="chapter-card" id={`${location.id}-${active.id}`}>
                <div className="chapter-card__meta">
                  <span>{active.durationLabel}</span>
                  <strong>
                    {String(activeChapter + 1).padStart(2, '0')} / {String(chapters.length).padStart(2, '0')}
                  </strong>
                </div>
                <h3>{active.title}</h3>
                <p>{active.body}</p>
                <div className="chapter-card__details">
                  {active.imageFocus ? (
                    <div>
                      <span>图像观察</span>
                      <p>{active.imageFocus}</p>
                    </div>
                  ) : null}
                  {active.soundCue ? (
                    <div>
                      <span>声音线索</span>
                      <p>{active.soundCue}</p>
                    </div>
                  ) : null}
                </div>
              </article>
              <div className="chapter-carousel__controls">
                <button
                  type="button"
                  onClick={() => setChapterState({ locationId: location.id, index: Math.max(0, activeChapter - 1) })}
                  disabled={activeChapter === 0}
                >
                  <ChevronLeft aria-hidden="true" />
                  <span>上一章</span>
                </button>
                <div className="chapter-carousel__dots" aria-hidden="true">
                  {chapters.map((chapter, index) => (
                    <span key={chapter.id} className={index === activeChapter ? 'is-active' : undefined} />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setChapterState({ locationId: location.id, index: Math.min(chapters.length - 1, activeChapter + 1) })}
                  disabled={activeChapter === chapters.length - 1}
                >
                  <span>下一章</span>
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="story-copy">
            {location.story.paragraphs.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? 'story-paragraph story-paragraph--lead story-reveal' : 'story-paragraph story-reveal'}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
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
        {location.pipeline ? (
          <div className="workflow-status story-reveal">
            <p className="section-kicker">workflow contract</p>
            <h3>{location.pipeline.status === 'ready' ? '离线产物已就绪' : '离线产物部分就绪'}</h3>
            <ul>
              {location.pipeline.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}
