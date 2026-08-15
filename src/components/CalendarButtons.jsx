import { config } from '../config'
import { downloadIcs, googleCalendarUrl } from '../lib/calendar'

const CalendarIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <rect
      x="3.5"
      y="6.5"
      width="25"
      height="22"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="M3.5 13h25" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M10 3.5v5M22 3.5v5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <text
      x="16"
      y="24"
      textAnchor="middle"
      fontSize="9"
      fill="currentColor"
      fontFamily="inherit"
    >
      31
    </text>
  </svg>
)

const DownloadIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <rect
      x="3.5"
      y="6.5"
      width="25"
      height="22"
      rx="3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="M3.5 13h25" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M10 3.5v5M22 3.5v5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M16 16v7m0 0 3-3m-3 3-3-3"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
)

// 예식일을 하객 캘린더에 저장하는 버튼 두 개. 02 예식 섹션의 D-day 아래에 붙는다.
// 카카오 톡캘린더는 링크만으로 일정을 추가하는 공식 방법이 없어(앱 등록 + 하객 개인의
// 카카오 로그인·동의 + 사용 권한 심사가 필요) 구글 캘린더와 표준 .ics 두 가지를 둔다.
// .ics 는 iPhone 기본 캘린더 · 아웃룩 · 네이버 캘린더 등이 읽는다.
export default function CalendarButtons() {
  if (!config.saveTheDate?.enabled) return null

  return (
    <div className="cal-btns">
      <a
        className="cal-btn"
        href={googleCalendarUrl()}
        target="_blank"
        rel="noreferrer"
      >
        <span className="cal-btn__i">
          <CalendarIcon />
        </span>
        <span className="cal-btn__text">
          <b>Google Calendar</b>
          <em>구글 캘린더에 일정 추가</em>
        </span>
        <span className="cal-btn__plus" aria-hidden="true">
          +
        </span>
      </a>

      <button className="cal-btn" type="button" onClick={downloadIcs}>
        <span className="cal-btn__i">
          <DownloadIcon />
        </span>
        <span className="cal-btn__text">
          <b>Apple · 기타 캘린더</b>
          <em>캘린더 파일(.ics) 내려받기</em>
        </span>
        <span className="cal-btn__plus" aria-hidden="true">
          +
        </span>
      </button>
    </div>
  )
}
