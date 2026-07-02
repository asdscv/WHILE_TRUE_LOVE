import { useEffect, useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'
import Folio from './Folio'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function parseYMD(iso) {
  const [datePart] = iso.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  return { y, m, d }
}

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

export default function CalendarDday() {
  const { wedding } = config
  const { y, m, d } = parseYMD(wedding.dateISO)
  const cd = useCountdown(wedding.dateISO)

  const firstWeekday = new Date(y, m - 1, 1).getDay()
  const daysInMonth = new Date(y, m, 0).getDate()
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  const bigDate = `${y}. ${String(m).padStart(2, '0')}. ${String(d).padStart(2, '0')}`
  const [gA, gB] = config.groomFirst
    ? [config.groom.name, config.bride.name]
    : [config.bride.name, config.groom.name]

  return (
    <section className="section calendar">
      <Reveal>
        <Folio n="02" label="예식" />
        <p className="calendar__bigdate">{bigDate}</p>
        <p className="calendar__sub">
          {wedding.dateText} · {wedding.timeText}
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="calendar__grid">
          {WEEKDAYS.map((w, i) => (
            <div
              key={w}
              className={`cal-cell cal-cell--head ${i === 0 ? 'cal-cell--sun' : ''}`}
            >
              {w}
            </div>
          ))}
          {cells.map((day, i) => {
            const isSun = i % 7 === 0
            const isTarget = day === d
            return (
              <div
                key={i}
                className={`cal-cell ${isSun ? 'cal-cell--sun' : ''} ${
                  isTarget ? 'cal-cell--target' : ''
                }`}
              >
                {day || ''}
              </div>
            )
          })}
        </div>
      </Reveal>

      <Reveal delay={200}>
        <p className="dday__text">
          <b>{gA}</b> · <b>{gB}</b>의 결혼식이{' '}
          {cd.past ? '있었습니다' : <>{cd.days}일 남았습니다</>}
        </p>
      </Reveal>
    </section>
  )
}
