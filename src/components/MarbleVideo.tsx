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
    <section className="bg-[#0D0B09] px-5 py-16 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <video className="w-full rounded-lg border border-[#3A2F22]" src={src} controls playsInline />
      </div>
    </section>
  )
}
