import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)
  const frameRef = useRef<number | null>(null)
  const latestRef = useRef(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: element,
        start: 'top top',
        end: 'bottom bottom',
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          latestRef.current = self.progress
          if (frameRef.current !== null) return
          frameRef.current = window.requestAnimationFrame(() => {
            frameRef.current = null
            setProgress(latestRef.current)
          })
        },
      })

      setProgress(trigger.progress)
    }, element)

    ScrollTrigger.refresh()
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
      ctx.revert()
    }
  }, [ref])

  return progress
}
