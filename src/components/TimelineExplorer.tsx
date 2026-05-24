import { ArrowRight, Waves } from 'lucide-react'
import { useMemo } from 'react'
import type { LocationData } from '../data/locations'
import { ImageExplorer } from './ImageExplorer'

interface Props {
  location: LocationData
  onSelectLocation: (id: string) => void
}

const EMPTY_TIMELINES: NonNullable<LocationData['timelines']> = []

export function TimelineExplorer({ location, onSelectLocation }: Props) {
  const rawTimelines = location.timelines ?? EMPTY_TIMELINES
  const frames = useMemo(
    () => [
      {
        id: `${location.id}-present`,
        yearLabel: String(location.presentYear),
        eraLabel: '现代',
        title: '今天的现场',
        subtitle: location.archiveNote,
        image: location.presentImage,
        summary: `先从现在的${location.name}开始，把游客动线、街口尺度和现存建筑关系看清楚，再往前切回历史节点。`,
        styleShift: '现代街区、景区动线和当代修缮痕迹成为进入历史的第一层参照。',
        soundCue: '现代人声、脚步、环境底噪',
      },
      ...[...rawTimelines].reverse(),
    ],
    [location.archiveNote, location.id, location.name, location.presentImage, location.presentYear, rawTimelines],
  )

  if (!frames.length) return null

  return (
    <section className="timeline-section" aria-label={`${location.name}时间线`}>
      <div className="timeline-shell">
        <div className="timeline-heading">
          <div>
            <p className="section-kicker">timeline notes</p>
            <h2>同一地点的四帧时间</h2>
          </div>
          <p>上方穿越段已经完成照片切换。这里仅保留时间节点和变化说明，方便用户回看每一帧对应的历史语义。</p>
        </div>

        <div className="timeline-scroll-steps" aria-label={`${location.name}滚动时间轴`}>
          {frames.map((item, index) => (
            <article
              key={item.id}
              data-timeline-frame={item.id}
            >
              <span className="timeline-scroll-steps__index">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <strong>{item.yearLabel}</strong>
                <em>{item.eraLabel}</em>
              </span>
              <small>{item.title}</small>
              <p>{item.summary}</p>
            </article>
          ))}
        </div>

        <div className="timeline-restoration-entry">
          <div>
            <p className="section-kicker">restored image</p>
            <strong>复原图探索</strong>
            <span>在时间线看清节点后，再打开 AI 复原图观察建筑、街面和人物细节。</span>
          </div>
          <ImageExplorer location={location} />
        </div>

        {location.relatedLocations?.length ? (
          <div className="related-location-list" aria-label={`${location.name}关联景点`}>
            {location.relatedLocations.map((related) => (
              <button
                key={related.id}
                type="button"
                data-related-location={related.id}
                onClick={() => onSelectLocation(related.id)}
              >
                <Waves aria-hidden="true" />
                <span>
                  <strong>{related.label}</strong>
                  <small>{related.reason}</small>
                </span>
                <em>
                  {related.actionLabel}
                  <ArrowRight aria-hidden="true" />
                </em>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
