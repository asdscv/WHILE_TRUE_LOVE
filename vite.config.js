import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from './src/config.js'

// 커스텀 도메인(https://aeshin-jiyong.life/)은 루트에서 서빙되므로 base 는 '/'.
// (다시 asdscv.github.io/WHILE_TRUE_LOVE/ 로 되돌리려면 base 를 '/WHILE_TRUE_LOVE/' 로.)
const SITE_URL = 'https://aeshin-jiyong.life/'

const WEEK = ['일', '월', '화', '수', '목', '금', '토']

// 카카오톡은 og:description 앞부분의 날짜/시간을 읽어 "일정 등록" 버튼을 붙여준다.
// 실제로 동작하는 청첩장 서비스들이 쓰는 형식이 아래와 같아 그대로 맞춘다.
//   2026.08.08.(토) 오후 5:00 부산 그랜드모먼트
function kakaoDateLine() {
  const d = new Date(config.wedding.dateISO)
  // dateISO 는 +09:00 기준이므로 한국 시간으로 읽는다.
  const kst = new Date(d.getTime() + 9 * 3600000)
  const p = (n) => String(n).padStart(2, '0')
  const y = kst.getUTCFullYear()
  const mo = p(kst.getUTCMonth() + 1)
  const day = p(kst.getUTCDate())
  const w = WEEK[kst.getUTCDay()]
  const h24 = kst.getUTCHours()
  const ampm = h24 < 12 ? '오전' : '오후'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  const venue = config.wedding.venue.name
  return `${y}.${mo}.${day}.(${w}) ${ampm} ${h12}:${p(kst.getUTCMinutes())} ${venue}`
}

// index.html 의 자리표시자를 config 값으로 채운다.
// (제목·날짜·장소를 config 한 곳에서만 고치면 공유 카드까지 따라온다)
function metaFromConfig() {
  const [a, b] = config.groomFirst
    ? [config.groom, config.bride]
    : [config.bride, config.groom]
  const values = {
    '%OG_TITLE%': `${a.name} ♥ ${b.name}, 결혼합니다`,
    '%OG_DESCRIPTION%': kakaoDateLine(),
    '%SITE_URL%': SITE_URL,
  }
  return {
    name: 'meta-from-config',
    transformIndexHtml(html) {
      return Object.entries(values).reduce(
        (out, [key, value]) => out.replaceAll(key, value),
        html,
      )
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), metaFromConfig()],
})
