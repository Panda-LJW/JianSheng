import { Box, ExternalLink } from 'lucide-react'
import type { LocationData } from '../data/locations'

export function MarbleWorldEntry({ location }: { location: LocationData }) {
  const world = location.marbleWorld

  if (!world) return null

  return (
    <section className="marble-world-section" aria-label={`${location.name} 3D 场景`}>
      <div className="marble-world-card">
        <div className="marble-world-card__media">
          <img src={world.thumbnail ?? location.pastImage} alt={`${location.name} Marble 3D 场景预览`} />
          <span className="marble-world-card__scan" aria-hidden="true" />
        </div>
        <div className="marble-world-card__body">
          <p className="section-kicker">marble world</p>
          <h2>走进历史现场</h2>
          <p>{world.caption ?? '从复原图进入可探索的 3D 场景，继续观察建筑、街道和人流关系。'}</p>
          <div className="marble-world-card__actions">
            <a className="primary-action" href={world.url} target="_blank" rel="noreferrer">
              <Box aria-hidden="true" />
              <span>进入 3D 场景</span>
              <ExternalLink aria-hidden="true" />
            </a>
            <span>{world.manifestPath}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
