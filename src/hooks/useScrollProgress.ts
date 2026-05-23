import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

function clamp(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function useScrollProgress(ref: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const update = () => {
      const element = ref.current
      if (!element) return
      const rect = element.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const travel = rect.height - viewport
      if (travel <= 0) {
        setProgress(rect.top < 0 ? 1 : 0)
        return
      }
      setProgress(clamp(-rect.top / travel))
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [ref])

  return progress
}
