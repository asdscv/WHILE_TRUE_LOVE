import { useEffect, useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'
import {
  addGuestbook,
  addRsvp,
  deleteGuestbook,
  isRemote,
  listGuestbook,
} from '../lib/store'

function formatDate(ts) {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
}

function Rsvp() {
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
    } catch {
      alert('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
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
        {busy ? '전송 중…' : '참석 여부 전하기'}
      </button>
    </form>
  )
}

function GuestbookBoard() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', message: '', password: '' })
  const [busy, setBusy] = useState(false)

  const refresh = () => listGuestbook().then(setItems).catch(() => {})
  useEffect(() => {
    refresh()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.message.trim())
      return alert('이름과 축하 메시지를 입력해주세요.')
    setBusy(true)
    try {
      await addGuestbook(form)
      setForm({ name: '', message: '', password: '' })
      await refresh()
    } catch {
      alert('등록에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (item) => {
    const pw = prompt('삭제하려면 비밀번호를 입력하세요.')
    if (pw === null) return
    try {
      await deleteGuestbook(item.id, pw)
      await refresh()
    } catch {
      alert('삭제에 실패했습니다.')
    }
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  return (
    <>
      <form className="gb-form" onSubmit={submit}>
        <div className="field-row">
          <label>
            <span>이름</span>
            <input value={form.name} onChange={set('name')} placeholder="이름" />
          </label>
          <label>
            <span>비밀번호(삭제용)</span>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="숫자 4자리"
            />
          </label>
        </div>
        <label className="field-full">
          <span>축하 메시지</span>
          <textarea
            value={form.message}
            onChange={set('message')}
            rows={3}
            placeholder="따뜻한 축하 한마디를 남겨주세요."
          />
        </label>
        <button className="submit-btn" disabled={busy}>
          {busy ? '등록 중…' : '축하글 남기기'}
        </button>
      </form>

      <ul className="gb-list">
        {items.length === 0 && (
          <li className="gb-empty">첫 번째 축하글을 남겨주세요 💌</li>
        )}
        {items.map((it) => (
          <li className="gb-item" key={it.id}>
            <div className="gb-item__head">
              <b>{it.name}</b>
              <span className="gb-item__date">{formatDate(it.ts)}</span>
              <button
                className="gb-item__del"
                onClick={() => remove(it)}
                aria-label="삭제"
              >
                ✕
              </button>
            </div>
            <p className="gb-item__msg">{it.message}</p>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Guestbook() {
  const showRsvp = config.rsvp.enabled
  const showGb = config.guestbook.enabled
  if (!showRsvp && !showGb) return null

  return (
    <section className="section guestbook">
      {showRsvp && (
        <>
          <Reveal>
            <h2 className="section__title">참석 여부 전달</h2>
            <p className="account__desc">
              원활한 예식 준비를 위해
              <br />
              참석 여부를 알려주시면 감사하겠습니다.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Rsvp />
          </Reveal>
        </>
      )}

      {showGb && (
        <>
          <Reveal>
            <h2
              className="section__title"
              style={{ marginTop: showRsvp ? 64 : 0 }}
            >
              축하 메시지
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <GuestbookBoard />
          </Reveal>
        </>
      )}

      {!isRemote() && (
        <p className="gb-note">
          ※ 현재 방명록/참석여부는 <b>이 기기에만 저장</b>됩니다. 하객들과
          공유·보존하려면 <code>src/config.js</code> 의 supabase 값을 설정하세요.
          (docs/supabase-setup.md)
        </p>
      )}
    </section>
  )
}
