import { useEffect, useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// ISO 문자열에서 연/월/일을 그대로 읽어 시간대 오차 없이 달력을 그립니다.
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

  // 해당 월 달력 구성
  const firstWeekday = new Date(y, m - 1, 1).getDay()
  const daysInMonth = new Date(y, m, 0).getDate()
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) cells.push(day)

  return (
    <section className="section calendar">
      <Reveal>
        <p className="section__eng">THE DAY</p>
        <h2 className="section__title">
          {wedding.dateText}
          <br />
          <span className="calendar__time">{wedding.timeText}</span>
        </h2>
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
        {cd.past ? (
          <p className="dday__done">💐 결혼을 축하해 주셔서 감사합니다 💐</p>
        ) : (
          <div className="dday">
            {[
              ['DAYS', cd.days],
              ['HOUR', cd.hours],
              ['MIN', cd.minutes],
              ['SEC', cd.seconds],
            ].map(([label, val]) => (
              <div className="dday__box" key={label}>
                <span className="dday__num">{String(val).padStart(2, '0')}</span>
                <span className="dday__label">{label}</span>
              </div>
            ))}
          </div>
        )}
      </Reveal>

      <Reveal delay={300}>
        <p className="dday__text">
          <b>
            {config.groomFirst ? config.groom.name : config.bride.name}
          </b>{' '}
          그리고{' '}
          <b>
            {config.groomFirst ? config.bride.name : config.groom.name}
          </b>
          의 결혼식이{' '}
          {cd.past ? '있었습니다.' : <b>{cd.days}일</b>}
          {cd.past ? '' : ' 남았습니다.'}
        </p>
      </Reveal>
    </section>
  )
}
