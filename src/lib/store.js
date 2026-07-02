// 방명록 / RSVP 저장소
// -----------------------------------------------------------------
// config.supabase 가 설정돼 있으면 Supabase(원격, 영구)에 저장하고,
// 없으면 이 브라우저의 localStorage 에 저장합니다(미리보기용).
import { supabase } from './supabaseClient'

const LS_GB = 'wtl_guestbook'
const LS_RSVP = 'wtl_rsvp'

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
export async function listGuestbook() {
  if (!supabase) return readLS(LS_GB)
  const { data, error } = await supabase
    .from('guestbook')
    .select('id,name,message,created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    message: r.message,
    ts: new Date(r.created_at).getTime(),
  }))
}

export async function addGuestbook({ name, message, password }) {
  if (!supabase) {
    const item = { id: `${Date.now()}`, name, message, password, ts: Date.now() }
    const list = readLS(LS_GB)
    list.unshift(item)
    writeLS(LS_GB, list)
    return item
  }
  const { error } = await supabase
    .from('guestbook')
    .insert({ name, message, password })
  if (error) throw error
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
export async function addRsvp(entry) {
  const { side, name, attend, count, meal, phone } = entry
  if (!supabase) {
    const item = { ...entry, ts: Date.now() }
    const list = readLS(LS_RSVP)
    list.unshift(item)
    writeLS(LS_RSVP, list)
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
}
