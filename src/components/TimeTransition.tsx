import type { LocationData } from '../data/locations'

interface Props {
  location: LocationData
  progress: number
}

export function TimeTransition({ location, progress }: Props) {
  const presentOpacity = Math.max(0, 1 - progress)
  const pastOpacity = Math.min(1, progress)
  const currentYear = Math.round(location.presentYear + (location.pastYear - location.presentYear) * progress)
  const firstTextOpacity = Math.max(0, Math.min(1, progress * 3))
  const secondTextOpacity = Math.max(0, Math.min(1, (progress - 0.42) * 3))

  return (
    <section className="time-transition" aria-label={`${location.name}时光过渡`}>
      <div className="time-transition__sticky">
        <img
          src={location.presentImage}
          alt={`${location.name}现状`}
          className="time-transition__image"
          style={{
            opacity: presentOpacity,
            objectPosition: location.imagePosition ?? 'center center',
          }}
        />
        <img
          src={location.pastImage}
          alt={`${location.name}历史复原`}
          className="time-transition__image"
          style={{
            opacity: pastOpacity,
            objectPosition: location.imagePosition ?? 'center center',
          }}
        />
        <div className="time-transition__shade" />
        <div className="time-transition__progress" style={{ transform: `scaleX(${progress})` }} />
        <div className="time-transition__center">
          <div className="time-transition__line" />
          <p className="section-kicker">scroll progress</p>
          <strong>{currentYear}</strong>
          <span>{location.era}</span>
          <p style={{ opacity: firstTextOpacity }}>图像渐渐模糊</p>
          <p style={{ opacity: secondTextOpacity }}>声音渐渐清晰</p>
        </div>
      </div>
    </section>
  )
}
