import { useEffect, useState } from 'react'
import { config } from '../config'
import RsvpForm from './RsvpForm'

const LS_HIDE_UNTIL = 'wtl_rsvp_popup_hide_until' // "오늘 하루 보지 않기" 만료 시각
const LS_SENT = 'wtl_rsvp_sent' // 이미 참석 여부를 보낸 기기

const todayKey = () => new Date().toISOString().slice(0, 10)

function shouldShow() {
  try {
    if (localStorage.getItem(LS_SENT) === '1') return false
    if (localStorage.getItem(LS_HIDE_UNTIL) === todayKey()) return false
  } catch {
    /* 프라이빗 모드 등에서 localStorage 접근 실패 시 그냥 노출 */
  }
  return true
}

// 인트로가 끝나고 본문으로 전환될 때 뜨는 참석 여부 안내 팝업.
// 본문의 "참석 여부" 섹션과 같은 폼을 쓰며, 어느 쪽에서 작성해도 동일하게 저장됩니다.
export default function RsvpPopup({ active }) {
  const { popup } = config.rsvp
  const { wedding } = config
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState('intro') // 'intro' | 'form'
  const [hideToday, setHideToday] = useState(false)

  useEffect(() => {
    if (!active || !config.rsvp.enabled || !popup.enabled) return
    if (!shouldShow()) return
    const t = setTimeout(() => setOpen(true), popup.delay)
    return () => clearTimeout(t)
  }, [active, popup.enabled, popup.delay])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, hideToday])

  const close = () => {
    if (hideToday) {
      try {
        localStorage.setItem(LS_HIDE_UNTIL, todayKey())
      } catch {
        /* 무시 */
      }
    }
    setOpen(false)
  }

  const onSubmitted = () => {
    try {
      localStorage.setItem(LS_SENT, '1')
    } catch {
      /* 무시 */
    }
    setTimeout(() => setOpen(false), 2200)
  }

  if (!open) return null

  return (
    <div
      className="popup"
      role="dialog"
      aria-modal="true"
      aria-label={popup.title}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="popup__card">
        <button className="popup__x" onClick={close} aria-label="닫기">
          ✕
        </button>

        <p className="popup__eyebrow">{popup.eyebrow}</p>
        <h2 className="popup__title">{popup.title}</h2>

        <dl className="popup__facts">
          <div>
            <dt>일시</dt>
            <dd>
              {wedding.dateText}
              <br />
              {wedding.timeText}
            </dd>
          </div>
          <div>
            <dt>장소</dt>
            <dd>
              {wedding.venue.name}
              {wedding.venue.hall ? ` ${wedding.venue.hall}` : ''}
              <br />
              <span className="popup__addr">{wedding.venue.address}</span>
            </dd>
          </div>
        </dl>

        {step === 'intro' ? (
          <>
            <p className="popup__msg">{popup.message}</p>
            <div className="popup__actions">
              <button
                className="submit-btn popup__cta"
                onClick={() => setStep('form')}
              >
                참석 여부 전하기
              </button>
              <button className="popup__later" onClick={close}>
                나중에 할게요
              </button>
            </div>
            <label className="popup__hide">
              <input
                type="checkbox"
                checked={hideToday}
                onChange={(e) => setHideToday(e.target.checked)}
              />
              <span>오늘 하루 보지 않기</span>
            </label>
          </>
        ) : (
          <div className="popup__form">
            <RsvpForm onSubmitted={onSubmitted} submitLabel="전하기" />
            <button className="popup__later" onClick={close}>
              닫기
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
