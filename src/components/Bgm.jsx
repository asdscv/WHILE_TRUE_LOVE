import { useEffect, useRef, useState } from 'react'
import { config } from '../config'

// 페이지 진입 시 배경음악 재생.
// 브라우저 자동재생 정책상 소리는 첫 사용자 동작(탭/스크롤) 이후 시작됩니다.
export default function Bgm() {
  const { bgm } = config
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!bgm.enabled) return
    const audio = ref.current
    if (!audio) return

    const start = () => {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false))
    }

    // 1) 바로 시도 (일부 브라우저에서 성공)
    start()

    // 2) 실패 대비 — 첫 사용자 동작에서 재생
    const onFirstInteract = () => {
      start()
      remove()
    }
    const remove = () => {
      ;['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((ev) =>
        window.removeEventListener(ev, onFirstInteract),
      )
    }
    ;['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach((ev) =>
      window.addEventListener(ev, onFirstInteract, { once: false, passive: true }),
    )
    return remove
  }, [bgm.enabled])

  if (!bgm.enabled) return null

  const src = `${import.meta.env.BASE_URL}bgm/${bgm.file}`

  const toggle = () => {
    const audio = ref.current
    if (!audio) return
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={ref} src={src} loop preload="auto" />
      <button
        className={`bgm-toggle ${playing ? 'bgm-toggle--on' : ''}`}
        onClick={toggle}
        aria-label={playing ? '음악 끄기' : '음악 켜기'}
        title={bgm.title || '배경음악'}
      >
        <span className="bgm-toggle__icon">{playing ? '♪' : '♪̸'}</span>
      </button>
    </>
  )
}
