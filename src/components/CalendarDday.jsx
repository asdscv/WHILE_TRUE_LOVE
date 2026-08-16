import { useEffect, useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'
import branch from '../assets/sections/branch.webp'
import CalendarButtons from './CalendarButtons'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function parseYMD(iso) {
  const [y, m, d] = iso.split('T')[0].split('-').map(Number)
  return { y, m, d }
}

const KST_OFFSET = 9 * 60 * 60 * 1000

// 어느 지역에서 보든 한국 달력 날짜로 세도록, 해당 시각을 KST 자정으로 내림한다.
function kstMidnight(ms) {
  const kst = new Date(ms + KST_OFFSET)
  return Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate())
}

// 남은 일수만 필요하므로 1분마다 갱신한다(자정 넘어가는 시점 반영용).
function useDaysLeft(targetISO) {
  const target = new Date(targetISO).getTime()
  const calc = () => {
    const now = Date.now()
    return {
      past: now > target,
      days: Math.max(0, (kstMidnight(target) - kstMidnight(now)) / 86400000),
    }
  }
  const [state, setState] = useState(calc)
  useEffect(() => {
    const t = setInterval(() => setState(calc()), 60000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetISO])
  return state
}

// 02 · 예식 — 원본 시안 이미지(954px 폭)를 실측해 HTML/CSS 로 옮긴 섹션.
// 달력은 dateISO 로부터 계산되고, 남은 일수도 실시간이다.
// 치수는 모두 --u(시안 1px) 단위이며, 전체 배율은 src/index.css 의 --cal-scale 로 조절한다.
export default function CalendarDday() {
  const { wedding } = config
  const { y, m, d } = parseYMD(wedding.dateISO)
  const { past, days } = useDaysLeft(wedding.dateISO)

  const firstWeekday = new Date(y, m - 1, 1).getDay()
  const daysInMonth = new Date(y, m, 0).getDate()
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const md = `${String(m).padStart(2, '0')}.${String(d).padStart(2, '0')}`
  const [gA, gB] = config.groomFirst
    ? [config.groom.name, config.bride.name]
    : [config.bride.name, config.groom.name]

  return (
    <section className="section cal">
      <Reveal>
        <p className="cal__folio">02 · 예식</p>
        <p className="cal__year">{y}</p>
        <p className="cal__md">{md}</p>
        <span className="cal__rule" aria-hidden="true" />
        <p className="cal__date">
          {wedding.dateText} · {wedding.timeText}
        </p>
        <img
          className="cal__branch"
          src={branch}
          width={102}
          height={42}
          alt=""
        />
      </Reveal>

      <Reveal delay={60}>
        <div className="cal__card">
          <p className="cal__month">{m}월</p>
          <div className="cal__grid cal__grid--head">
            {WEEKDAYS.map((w, i) => (
              <div
                key={w}
                className={`cal__cell${i === 0 ? ' cal__cell--sun' : ''}`}
              >
                <span>{w}</span>
              </div>
            ))}
          </div>
          <span className="cal__hr" aria-hidden="true" />
          <div className="cal__grid">
            {cells.map((day, i) => (
              <div
                key={i}
                className={`cal__cell${i % 7 === 0 ? ' cal__cell--sun' : ''}${
                  day === d ? ' cal__cell--target' : ''
                }`}
              >
                <span>{day || ''}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="dday">
          <span className="dday__rule" aria-hidden="true" />
          <p className="dday__text">
            {gA} · {gB}의 결혼식이
            <br />
            {past ? '있었습니다' : `${days}일 남았습니다`}
          </p>
          <CalendarButtons />
        </div>
      </Reveal>
    </section>
  )
}
