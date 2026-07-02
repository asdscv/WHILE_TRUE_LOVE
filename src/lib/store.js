// 방명록 / RSVP 저장소
// -----------------------------------------------------------------
// config 에 endpoint(Google Apps Script 웹앱 주소)가 있으면 원격 저장,
// 없으면 이 브라우저의 localStorage 에 저장합니다(미리보기용).
import { config } from '../config'

const LS_GB = 'wtl_guestbook'
const LS_RSVP = 'wtl_rsvp'

const gbEndpoint = () => config.guestbook.endpoint?.trim() || ''
const rsvpEndpoint = () =>
  config.rsvp.endpoint?.trim() || config.guestbook.endpoint?.trim() || ''

const readLS = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]')
  } catch {
    return []
  }
}
const writeLS = (key, val) => localStorage.setItem(key, JSON.stringify(val))

// text/plain 으로 보내 CORS preflight 를 피합니다(Apps Script 호환).
const postJSON = (url, body) =>
  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  })

// ---------------- 방명록 ----------------
export async function listGuestbook() {
  const url = gbEndpoint()
  if (!url) return readLS(LS_GB)
  const res = await fetch(`${url}?action=list`)
  const data = await res.json()
  return data.items || []
}

export async function addGuestbook({ name, message, password }) {
  const item = { id: `${Date.now()}`, name, message, password, ts: Date.now() }
  const url = gbEndpoint()
  if (!url) {
    const list = readLS(LS_GB)
    list.unshift(item)
    writeLS(LS_GB, list)
    return item
  }
  await postJSON(url, { action: 'guestbook', ...item })
  return item
}

export async function deleteGuestbook(id, password) {
  const url = gbEndpoint()
  if (!url) {
    const list = readLS(LS_GB).filter(
      (it) => !(it.id === id && it.password === password),
    )
    writeLS(LS_GB, list)
    return true
  }
  await postJSON(url, { action: 'delete', id, password })
  return true
}

// ---------------- RSVP ----------------
export async function addRsvp(entry) {
  const item = { ...entry, ts: Date.now() }
  const url = rsvpEndpoint()
  if (!url) {
    const list = readLS(LS_RSVP)
    list.unshift(item)
    writeLS(LS_RSVP, list)
    return item
  }
  await postJSON(url, { action: 'rsvp', ...item })
  return item
}

export const isRemote = () => !!gbEndpoint()
