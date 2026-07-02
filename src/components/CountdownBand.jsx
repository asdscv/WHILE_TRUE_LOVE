import { useEffect, useState } from 'react'
import { config } from '../config'
import { galleryImages } from '../gallery'

function useCountdown(targetISO) {
  const [left, setLeft] = useState(() => new Date(targetISO).getTime() - Date.now())
  useEffect(() => {
    const t = setInterval(
      () => setLeft(new Date(targetISO).getTime() - Date.now()),
      1000,
    )
    return () => clearInterval(t)
  }, [targetISO])
  const past = left <= 0
  const s = Math.max(0, Math.floor(left / 1000))
  return {
    past,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

const pad = (n) => String(n).padStart(2, '0')

export default function CountdownBand({ index = 3 }) {
  const cd = useCountdown(config.wedding.dateISO)
  const img = galleryImages[index] || galleryImages[galleryImages.length - 1]

  const units = [
    [String(cd.days), '일'],
    [pad(cd.hours), '시'],
    [pad(cd.minutes), '분'],
    [pad(cd.seconds), '초'],
  ]

  return (
    <section
      className="countdown"
      style={{ backgroundImage: `url(${img})` }}
      aria-label="결혼식까지 남은 시간"
    >
      <div className="countdown__overlay" />
      <div className="countdown__inner">
        <p className="countdown__caption">
          {cd.past ? '함께해 주셔서 감사합니다' : '결혼식까지'}
        </p>
        {!cd.past && (
          <div className="cd">
            {units.map(([num, label]) => (
              <div className="cd__u" key={label}>
                <span className="cd__n">{num}</span>
                <span className="cd__l">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
