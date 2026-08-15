import { config } from '../config'

// 예식 일정을 캘린더에 넣기 위한 값들.
// 모든 값은 config.wedding 에서 나오므로 dateISO 만 바꾸면 전부 따라온다.
function eventInfo() {
  const { wedding, groom, bride, groomFirst } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]
  const start = new Date(wedding.dateISO)
  const end = new Date(
    start.getTime() + (config.saveTheDate?.durationHours ?? 2) * 3600000,
  )
  const place = [wedding.venue.name, wedding.venue.hall, wedding.venue.address]
    .filter(Boolean)
    .join(' ')
  return {
    title: `${a.name} ♥ ${b.name} 결혼식`,
    place,
    start,
    end,
    details: `${wedding.dateText} ${wedding.timeText}\n${place}`,
  }
}

// 캘린더 형식은 UTC 기본형(YYYYMMDDTHHMMSSZ)을 쓴다.
const utc = (d) => d.toISOString().replace(/[-:]|\.\d{3}/g, '')

export function googleCalendarUrl() {
  const { title, place, start, end, details } = eventInfo()
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${utc(start)}/${utc(end)}`,
    location: place,
    details,
  })
  return `https://calendar.google.com/calendar/render?${q}`
}

// iPhone 기본 캘린더 · 아웃룩 · 네이버 캘린더 등이 읽는 표준 파일.
// 줄바꿈은 규격상 CRLF 여야 하고, 쉼표·세미콜론은 이스케이프해야 한다.
function icsText() {
  const { title, place, start, end, details } = eventInfo()
  const esc = (s) => s.replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//while-true-love//wedding//KO',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:wedding-${utc(start)}@aeshin-jiyong.life`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${utc(start)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(place)}`,
    `DESCRIPTION:${esc(details)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:-P1D',
    `DESCRIPTION:${esc(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadIcs() {
  const blob = new Blob([icsText()], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'wedding.ics'
  document.body.appendChild(a)
  a.click()
  a.remove()
  // 곧바로 해제하면 사파리에서 저장이 끊기는 경우가 있어 잠시 뒤에 정리한다.
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}
