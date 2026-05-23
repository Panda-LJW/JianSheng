import { useEffect, useRef, useState } from 'react'

interface BgmState {
  muted: boolean
  ready: boolean
  toggleMuted: () => void
}

export function useBgmPlayer(src: string, progress: number): BgmState {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    audio.volume = 1
    audioRef.current = audio

    return () => {
      audio.pause()
      audioRef.current = null
      gainRef.current?.disconnect()
      sourceRef.current?.disconnect()
      contextRef.current?.close().catch(() => undefined)
      gainRef.current = null
      sourceRef.current = null
      contextRef.current = null
      setReady(false)
    }
  }, [src])

  useEffect(() => {
    const unlock = async () => {
      const audio = audioRef.current
      if (!audio) return
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext
      if (!AudioContextCtor) return
      if (!contextRef.current) {
        const context = new AudioContextCtor()
        const gain = context.createGain()
        const source = context.createMediaElementSource(audio)
        source.connect(gain)
        gain.connect(context.destination)
        gain.gain.value = 0
        contextRef.current = context
        gainRef.current = gain
        sourceRef.current = source
      }
      await contextRef.current.resume()
      try {
        await audio.play()
        setReady(true)
      } catch {
        setReady(false)
      }
    }

    window.addEventListener('scroll', unlock, { passive: true, once: true })
    window.addEventListener('pointerdown', unlock, { passive: true, once: true })
    return () => {
      window.removeEventListener('scroll', unlock)
      window.removeEventListener('pointerdown', unlock)
    }
  }, [src])

  useEffect(() => {
    const gain = gainRef.current
    if (!gain) return
    const target = muted ? 0 : Math.min(1, Math.max(0, progress))
    const context = contextRef.current
    if (context) {
      gain.gain.setTargetAtTime(target, context.currentTime, 0.08)
    } else {
      gain.gain.value = target
    }
  }, [muted, progress])

  return {
    muted,
    ready,
    toggleMuted: () => setMuted((value) => !value),
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}
