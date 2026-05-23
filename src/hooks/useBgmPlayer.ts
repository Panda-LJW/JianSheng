import { useCallback, useEffect, useRef, useState } from 'react'

export interface BgmState {
  muted: boolean
  ready: boolean
  playing: boolean
  currentTime: number
  duration: number
  toggleMuted: () => void
  togglePlayback: () => void
}

function clampProgress(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function useBgmPlayer(src: string, progress: number): BgmState {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const contextRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null)
  const unlockingRef = useRef(false)
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 1
    audioRef.current = audio

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0)
    const syncPlaying = () => setPlaying(!audio.paused)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('play', syncPlaying)
    audio.addEventListener('pause', syncPlaying)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('play', syncPlaying)
      audio.removeEventListener('pause', syncPlaying)
      audioRef.current = null
      gainRef.current?.disconnect()
      sourceRef.current?.disconnect()
      contextRef.current?.close().catch(() => undefined)
      gainRef.current = null
      sourceRef.current = null
      contextRef.current = null
      unlockingRef.current = false
      setReady(false)
      setPlaying(false)
      setCurrentTime(0)
      setDuration(0)
    }
  }, [src])

  const ensureAudio = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || unlockingRef.current) return false
    unlockingRef.current = true
    try {
      const AudioContextCtor = window.AudioContext || window.webkitAudioContext
      if (AudioContextCtor && !contextRef.current) {
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

      if (contextRef.current) {
        await contextRef.current.resume()
      }

      await audio.play()
      setReady(true)
      setPlaying(true)
      return true
    } catch {
      setReady(false)
      setPlaying(false)
      return false
    } finally {
      unlockingRef.current = false
    }
  }, [])

  useEffect(() => {
    const unlock = () => {
      void ensureAudio()
    }

    window.addEventListener('scroll', unlock, { passive: true })
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    return () => {
      window.removeEventListener('scroll', unlock)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [ensureAudio])

  useEffect(() => {
    const gain = gainRef.current
    const target = muted ? 0 : clampProgress(progress)
    if (!gain) return
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
    playing,
    currentTime,
    duration,
    toggleMuted: () => setMuted((value) => !value),
    togglePlayback: () => {
      const audio = audioRef.current
      if (!audio) return
      if (audio.paused) {
        void ensureAudio()
      } else {
        audio.pause()
      }
    },
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}
