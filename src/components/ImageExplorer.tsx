import { Maximize2, Minus, Plus, RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { LocationData } from '../data/locations'

interface Props {
  location: LocationData
}

const MIN_SCALE = 1
const MAX_SCALE = 2.4

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function ImageExplorer({ location }: Props) {
  const [open, setOpen] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 })
  const stageRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null)

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
      if (event.key === '+' || event.key === '=') setScale((value) => clamp(value + 0.2, MIN_SCALE, MAX_SCALE))
      if (event.key === '-') setScale((value) => clamp(value - 0.2, MIN_SCALE, MAX_SCALE))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const stage = stageRef.current
    if (!stage) return undefined

    const updateStageSize = () => {
      const rect = stage.getBoundingClientRect()
      setStageSize({ width: rect.width, height: rect.height })
    }

    updateStageSize()
    const observer = new ResizeObserver(updateStageSize)
    observer.observe(stage)
    window.addEventListener('resize', updateStageSize)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateStageSize)
    }
  }, [open])

  function reset() {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  function updateScale(nextScale: number) {
    const clamped = clamp(nextScale, MIN_SCALE, MAX_SCALE)
    setScale(clamped)
    if (clamped === 1) setOffset({ x: 0, y: 0 })
  }

  const fittedImage = useMemo(() => {
    if (!stageSize.width || !stageSize.height || !imageSize.width || !imageSize.height) {
      return { width: 0, height: 0 }
    }

    const fit = Math.min(stageSize.width / imageSize.width, stageSize.height / imageSize.height)
    return {
      width: Math.round(imageSize.width * fit),
      height: Math.round(imageSize.height * fit),
    }
  }, [imageSize.height, imageSize.width, stageSize.height, stageSize.width])

  const explorer = (
    <div className="image-explorer" role="dialog" aria-modal="true" aria-label={`${location.name}复原图探索`}>
      <div className="image-explorer__topbar">
        <div>
          <p className="section-kicker">restored image</p>
          <strong>{location.name}</strong>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="关闭复原图探索">
          <X aria-hidden="true" />
        </button>
      </div>

      <div
        ref={stageRef}
        className="image-explorer__stage"
        onPointerDown={(event) => {
          dragRef.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y }
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const drag = dragRef.current
          if (!drag || scale === 1) return
          setOffset({
            x: clamp(drag.offsetX + event.clientX - drag.x, -140 * scale, 140 * scale),
            y: clamp(drag.offsetY + event.clientY - drag.y, -140 * scale, 140 * scale),
          })
        }}
        onPointerUp={(event) => {
          dragRef.current = null
          event.currentTarget.releasePointerCapture(event.pointerId)
        }}
        onWheel={(event) => {
          event.preventDefault()
          updateScale(scale + (event.deltaY > 0 ? -0.12 : 0.12))
        }}
      >
        <div
          className={scale > 1.2 ? 'image-explorer__canvas is-zoomed' : 'image-explorer__canvas'}
          style={{
            width: fittedImage.width || undefined,
            height: fittedImage.height || undefined,
            transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${scale})`,
          }}
        >
          <img
            src={location.pastImage}
            alt={`${location.name}历史复原大图`}
            onLoad={(event) => {
              setImageSize({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              })
            }}
          />
          {location.imageHotspots?.map((hotspot) => (
            <button
              key={hotspot.id}
              type="button"
              className="image-hotspot"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              aria-label={`${hotspot.title}：${hotspot.description}`}
            >
              <span />
              <strong>{hotspot.title}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="image-explorer__controls" aria-label="复原图缩放控制">
        <button type="button" onClick={() => updateScale(scale - 0.2)} aria-label="缩小复原图">
          <Minus aria-hidden="true" />
        </button>
        <span>{Math.round(scale * 100)}%</span>
        <button type="button" onClick={() => updateScale(scale + 0.2)} aria-label="放大复原图">
          <Plus aria-hidden="true" />
        </button>
        <button type="button" onClick={reset} aria-label="重置复原图">
          <RotateCcw aria-hidden="true" />
        </button>
      </div>

      <div className="image-explorer__notes">
        {location.imageHotspots?.map((hotspot) => (
          <article key={hotspot.id}>
            <strong>{hotspot.title}</strong>
            <p>{hotspot.description}</p>
          </article>
        ))}
      </div>
    </div>
  )

  return (
    <>
      <button type="button" className="explore-image-button" onClick={() => setOpen(true)}>
        <Maximize2 aria-hidden="true" />
        <span>查看复原图</span>
      </button>

      {open ? createPortal(explorer, document.body) : null}
    </>
  )
}
