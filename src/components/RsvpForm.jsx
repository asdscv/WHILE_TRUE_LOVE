import { useState } from 'react'
import { addRsvp, RateLimitError } from '../lib/store'

// 참석 여부(RSVP) 입력 폼.
// 본문의 "참석 여부" 섹션과 첫 화면 팝업에서 함께 사용됩니다.
export default function RsvpForm({ onSubmitted, submitLabel = '참석 여부 전하기' }) {
  const [form, setForm] = useState({
    side: '신랑측',
    name: '',
    attend: '참석',
    count: 1,
    meal: '예정',
    phone: '',
  })
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return alert('성함을 입력해주세요.')
    setBusy(true)
    try {
      await addRsvp(form)
      setDone(true)
      onSubmitted?.(form)
    } catch (err) {
      alert(
        err instanceof RateLimitError
          ? err.message
          : '전송에 실패했습니다. 잠시 후 다시 시도해주세요.',
      )
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <p className="rsvp__thanks">
        참석 의사를 전해주셔서 감사합니다. 🙏
        <br />
        소중한 걸음으로 함께해 주세요.
      </p>
    )
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <form className="rsvp-form" onSubmit={submit}>
      <div className="field-row">
        <label>
          <span>구분</span>
          <select value={form.side} onChange={set('side')}>
            <option>신랑측</option>
            <option>신부측</option>
          </select>
        </label>
        <label>
          <span>참석여부</span>
          <select value={form.attend} onChange={set('attend')}>
            <option>참석</option>
            <option>미정</option>
            <option>불참</option>
          </select>
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>성함</span>
          <input value={form.name} onChange={set('name')} placeholder="홍길동" />
        </label>
        <label>
          <span>인원</span>
          <input
            type="number"
            min="1"
            value={form.count}
            onChange={set('count')}
          />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>식사여부</span>
          <select value={form.meal} onChange={set('meal')}>
            <option>예정</option>
            <option>안함</option>
            <option>미정</option>
          </select>
        </label>
        <label>
          <span>연락처(선택)</span>
          <input
            value={form.phone}
            onChange={set('phone')}
            placeholder="010-0000-0000"
          />
        </label>
      </div>
      <button className="submit-btn" disabled={busy}>
        {busy ? '전송 중…' : submitLabel}
      </button>
    </form>
  )
}
