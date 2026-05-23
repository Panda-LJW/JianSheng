import { Play } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  src?: string
}

export function MarbleVideo({ src }: Props) {
  const [exists, setExists] = useState(false)

  useEffect(() => {
    if (!src) return
    let cancelled = false
    fetch(src, { method: 'HEAD' })
      .then((response) => {
        if (!cancelled) setExists(response.ok)
      })
      .catch(() => {
        if (!cancelled) setExists(false)
      })
    return () => {
      cancelled = true
    }
  }, [src])

  if (!src || !exists) return null

  return (
    <section className="marble-video-section">
      <div className="section-kicker">walk into the scene</div>
      <h2>走进历史现场</h2>
      <div className="marble-video-shell">
        <video src={src} controls playsInline preload="metadata" />
        <div className="marble-video-mark" aria-hidden="true">
          <Play />
        </div>
      </div>
    </section>
  )
}
