import { useEffect, useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'
import weddingImage from '../assets/sections/02-wedding.webp'

// 남은 일수만 필요하므로 1분마다 갱신한다(자정 넘어가는 시점 반영용).
function useDaysLeft(targetISO) {
  const calc = () => new Date(targetISO).getTime() - Date.now()
  const [left, setLeft] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setLeft(calc()), 60000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetISO])
  return { past: left <= 0, days: Math.floor(Math.max(0, left) / 86400000) }
}

// 02 · 예식 — 날짜·달력은 완성 이미지 한 장.
// 다만 "몇 일 남았습니다" 는 매일 달라지므로 이미지에서 잘라내고 아래에 실시간으로 그린다.
// (이미지 하단 여백/세로 룰 비율에 맞추려고 치수를 vw 로 따라가게 했다 — src/index.css 의 .dday 참고)
export default function CalendarDday() {
  const { wedding } = config
  const { past, days } = useDaysLeft(wedding.dateISO)

  const [gA, gB] = config.groomFirst
    ? [config.groom.name, config.bride.name]
    : [config.bride.name, config.groom.name]

  return (
    <section className="section calendar">
      <Reveal>
        <img
          className="calendar__img"
          src={weddingImage}
          width={954}
          height={1400}
          alt={`02 예식 — ${wedding.dateText} ${wedding.timeText}`}
        />
      </Reveal>

      <Reveal delay={80}>
        <div className="dday">
          <span className="dday__rule" aria-hidden="true" />
          <p className="dday__text">
            {gA} · {gB}의 결혼식이
            <br />
            {past ? '있었습니다' : `${days}일 남았습니다`}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
