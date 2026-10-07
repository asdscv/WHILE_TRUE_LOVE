import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// 참석 명단 조회(관리자용) 화면. /attendant 경로에서만 렌더링됩니다.
// 비밀번호는 Supabase RPC(get_rsvp_list) 안에서 해시로 검증하고,
// 통과해야만 rsvp 테이블(이름·전화번호 포함)을 읽어옵니다.

// 같은 이름으로 여러 번 제출된 경우, 가장 나중 제출을 최종 응답으로 보고
// 그보다 앞선 제출은 버립니다(정정/중복 제출 처리).
function dedupeByLatestName(rows) {
  const byName = new Map()
  for (const r of rows) {
    const key = r.name.trim()
    const prev = byName.get(key)
    if (!prev || new Date(r.created_at) > new Date(prev.created_at)) {
      byName.set(key, r)
    }
  }
  return [...byName.values()]
}

function SideTable({ title, rows }) {
  const total = rows.reduce((sum, r) => sum + r.count, 0)
  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>
        {title} · {rows.length}건 / {total}명
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
            <th style={{ padding: '6px 8px' }}>이름</th>
            <th style={{ padding: '6px 8px' }}>인원</th>
            <th style={{ padding: '6px 8px' }}>식사</th>
            <th style={{ padding: '6px 8px' }}>연락처</th>
            <th style={{ padding: '6px 8px' }}>제출일</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: '6px 8px' }}>{r.name}</td>
              <td style={{ padding: '6px 8px' }}>{r.count}</td>
              <td style={{ padding: '6px 8px' }}>{r.meal}</td>
              <td style={{ padding: '6px 8px' }}>{r.phone || '-'}</td>
              <td style={{ padding: '6px 8px', color: '#888' }}>
                {new Date(r.created_at).toLocaleDateString('ko-KR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Attendant() {
  const [password, setPassword] = useState('')
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (!supabase) throw new Error('Supabase 연결이 설정되지 않았습니다.')
      const { data, error } = await supabase.rpc('get_rsvp_list', {
        p_password: password,
      })
      if (error) throw error
      setRows(data)
    } catch (err) {
      setError(err.message || '조회에 실패했습니다.')
    } finally {
      setBusy(false)
    }
  }

  if (rows === null) {
    return (
      <div style={{ maxWidth: 360, margin: '80px auto', padding: 16, fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: 18, marginBottom: 16 }}>참석 명단 조회</h2>
        <form onSubmit={submit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            style={{ width: '100%', padding: 10, fontSize: 16, boxSizing: 'border-box' }}
            autoFocus
          />
          <button
            disabled={busy}
            style={{ width: '100%', padding: 10, marginTop: 10, fontSize: 16 }}
          >
            {busy ? '확인 중…' : '확인'}
          </button>
        </form>
        {error && <p style={{ color: 'crimson', marginTop: 12 }}>{error}</p>}
      </div>
    )
  }

  const attending = dedupeByLatestName(rows.filter((r) => r.attend === '참석'))
  const groom = attending
    .filter((r) => r.side === '신랑측')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  const bride = attending
    .filter((r) => r.side === '신부측')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  const totalCount = groom.reduce((s, r) => s + r.count, 0) + bride.reduce((s, r) => s + r.count, 0)

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16, fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: 20, marginBottom: 4 }}>참석 명단</h2>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        총 {groom.length + bride.length}건 / {totalCount}명 (같은 이름 재제출은 최근 제출로 정리됨)
      </p>
      <SideTable title="신랑측" rows={groom} />
      <SideTable title="신부측" rows={bride} />
    </div>
  )
}
