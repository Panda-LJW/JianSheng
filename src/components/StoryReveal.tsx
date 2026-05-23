import { useEffect, useRef, useState } from 'react'
import type { LocationData } from '../data/locations'

function RevealParagraph({ text, index }: { text: string; index: number }) {
  const ref = useRef<HTMLParagraphElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <p
      ref={ref}
      className={`max-w-2xl text-balance font-serif text-2xl leading-relaxed text-[#E8DFD0] transition duration-700 sm:text-3xl ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {text}
    </p>
  )
}

export function StoryReveal({ location }: { location: LocationData }) {
  return (
    <section className="relative bg-[#0D0B09] px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-5xl gap-12">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.32em] text-[#C69B49]">archive voice</p>
          <h2 className="mt-3 font-serif text-4xl text-[#E8DFD0]">听见这段时间</h2>
        </div>
        <div className="grid gap-16">
          {location.story.paragraphs.map((paragraph, index) => (
            <RevealParagraph key={paragraph} text={paragraph} index={index} />
          ))}
        </div>
        <blockquote className="mt-8 border-l border-[#C69B49] pl-5 font-serif text-3xl leading-tight text-[#C69B49] sm:text-5xl">
          {location.story.highlightQuote}
        </blockquote>
      </div>
    </section>
  )
}
