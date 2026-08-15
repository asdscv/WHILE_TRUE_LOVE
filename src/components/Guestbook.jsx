import { useEffect, useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'
import Collapsible from './Collapsible'
import RsvpForm from './RsvpForm'
import {
  addGuestbook,
  deleteGuestbook,
  isRemote,
  listGuestbook,
} from '../lib/store'

function formatDate(ts) {
  const d = new Date(ts)
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
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
      return alert('이름과 축하의 글을 입력해주세요.')
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
          <span>축하의 글</span>
          <textarea
            value={form.message}
            onChange={set('message')}
            rows={3}
            placeholder="따뜻한 축하 한마디를 남겨주세요."
          />
        </label>
        <button className="submit-btn" disabled={busy}>
          {busy ? '등록 중…' : '축하의 글 남기기'}
        </button>
      </form>

      <ul className="gb-list">
        {items.length === 0 && (
          <li className="gb-empty">첫 번째 축하의 글을 남겨주세요 💌</li>
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
        <Reveal id="rsvp">
          <Collapsible n="05" label="축하" title="참석 여부 전달">
            <p className="account__desc">
              예식 장소가 협소하여 자리가 한정되어 있습니다.
              <br />
              참석 여부를 미리 알려주시면 정성껏 준비하겠습니다.
            </p>
            <RsvpForm />
          </Collapsible>
        </Reveal>
      )}

      {showGb && (
        <Reveal id="guestbook">
          <Collapsible n="06" label="축하의 글" title="축하의 글">
            <GuestbookBoard />
          </Collapsible>
        </Reveal>
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
