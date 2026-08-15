// 방명록 / RSVP 저장소
// -----------------------------------------------------------------
// config.supabase 가 설정돼 있으면 Supabase(원격, 영구)에 저장하고,
// 없으면 이 브라우저의 localStorage 에 저장합니다(미리보기용).
import { config } from '../config'
import { supabase } from './supabaseClient'

const LS_GB = 'wtl_guestbook'
const LS_RSVP = 'wtl_rsvp'
const LS_THROTTLE = 'wtl_submits'

// ---------------- 제출 제한 ----------------
// 실수로 여러 번 누르거나 장난삼아 도배하는 걸 막는 기기 단위 제한.
// 서버(Supabase) 쪽 제한은 docs/supabase-setup.md 의 트리거를 함께 걸어야 완전하다.
const LIMITS = {
  rsvp: { minGapMs: 30_000, perDay: 5 },
  guestbook: { minGapMs: 20_000, perDay: 10 },
}

export class RateLimitError extends Error {}

function checkRate(kind) {
  const { minGapMs, perDay } = LIMITS[kind]
  let log
  try {
    log = JSON.parse(localStorage.getItem(LS_THROTTLE) || '{}')
  } catch {
    log = {}
  }
  const now = Date.now()
  const times = (log[kind] || []).filter((t) => now - t < 86400000)

  if (times.length && now - times[times.length - 1] < minGapMs) {
    const wait = Math.ceil((minGapMs - (now - times[times.length - 1])) / 1000)
    throw new RateLimitError(`잠시 후 다시 시도해주세요. (${wait}초)`)
  }
  if (times.length >= perDay) {
    throw new RateLimitError(
      '오늘은 더 이상 등록할 수 없습니다. 내일 다시 시도해주세요.',
    )
  }
  return () => {
    log[kind] = [...times, Date.now()]
    try {
      localStorage.setItem(LS_THROTTLE, JSON.stringify(log))
    } catch {
      /* 저장 실패는 무시 */
    }
  }
}

const readLS = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}
const writeLS = (key, val) => localStorage.setItem(key, JSON.stringify(val))

export const isRemote = () => !!supabase

// ---------------- 방명록 ----------------
// limit 개씩 끊어서 가져온다. 다음 페이지가 있는지 알려고 한 개를 더 요청하고 잘라낸다.
export async function listGuestbook({ limit = 5, offset = 0 } = {}) {
  if (!supabase) {
    const all = readLS(LS_GB)
    return { items: all.slice(offset, offset + limit), hasMore: all.length > offset + limit }
  }
  const { data, error } = await supabase
    .from('guestbook')
    .select('id,name,message,created_at')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit)
  if (error) throw error
  return {
    items: data.slice(0, limit).map((r) => ({
      id: r.id,
      name: r.name,
      message: r.message,
      ts: new Date(r.created_at).getTime(),
    })),
    hasMore: data.length > limit,
  }
}

export async function addGuestbook({ name, message, password }) {
  const commit = checkRate('guestbook')
  if (!supabase) {
    const item = { id: `${Date.now()}`, name, message, password, ts: Date.now() }
    const list = readLS(LS_GB)
    list.unshift(item)
    writeLS(LS_GB, list)
    commit()
    return item
  }
  const { error } = await supabase
    .from('guestbook')
    .insert({ name, message, password })
  if (error) throw error
  commit()
}

export async function deleteGuestbook(id, password) {
  if (!supabase) {
    const list = readLS(LS_GB).filter(
      (it) => !(it.id === id && it.password === password),
    )
    writeLS(LS_GB, list)
    return true
  }
  const { error } = await supabase.rpc('delete_guestbook', {
    p_id: id,
    p_password: password,
  })
  if (error) throw error
  return true
}

// ---------------- RSVP ----------------
// 저장과 별개로 신랑신부에게 메일 알림을 보낸다.
// config.rsvp.email.endpoint 가 비어 있으면 아무것도 하지 않는다.
// 메일이 실패해도 제출 자체는 성공으로 처리한다(기록은 Supabase 에 이미 남았으므로).
async function notifyByEmail(entry) {
  const endpoint = config.rsvp?.email?.endpoint
  if (!endpoint) return
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `[청첩장] 참석여부 · ${entry.name} (${entry.attend})`,
        _template: 'table',
        _captcha: 'false',
        ...(cfg.accessKey ? { access_key: cfg.accessKey } : {}),
        구분: entry.side,
        성함: entry.name,
        참석여부: entry.attend,
        인원: String(entry.count),
        식사여부: entry.meal,
        연락처: entry.phone || '-',
      }),
    })
  } catch {
    /* 알림 실패는 무시 */
  }
}

export async function addRsvp(entry) {
  const commit = checkRate('rsvp')
  const { side, name, attend, count, meal, phone } = entry
  if (!supabase) {
    const item = { ...entry, ts: Date.now() }
    const list = readLS(LS_RSVP)
    list.unshift(item)
    writeLS(LS_RSVP, list)
    commit()
    await notifyByEmail(entry)
    return item
  }
  const { error } = await supabase.from('rsvp').insert({
    side,
    name,
    attend,
    count: Number(count) || 1,
    meal,
    phone,
  })
  if (error) throw error
  commit()
  await notifyByEmail(entry)
}
