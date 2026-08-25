import { useEffect, useRef, useState } from 'react'
import { config } from '../config'
import dancing from '../assets/bgm/dancing.webp'
import still from '../assets/bgm/still.webp'

// 페이지 진입 시 배경음악 재생 + 우측 상단 켜기/끄기 토글.
// 브라우저 자동재생 정책상 소리는 첫 사용자 동작(탭/스크롤) 이후 시작됩니다.
export default function Bgm() {
  const { bgm } = config
  const ref = useRef(null)
  const [playing, setPlaying] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!bgm.enabled) return
    const audio = ref.current
    if (!audio) return

    const play = () => {
      audio
        .play()
        .then(() => {
          startedRef.current = true
          setPlaying(true)
        })
        .catch(() => setPlaying(false))
    }

    // 1) 즉시 시도 (일부 브라우저에서 성공)
    play()

    // 2) 실패 대비 — 첫 사용자 동작에서 재생.
    //    단, 토글 버튼을 누른 경우는 무시하고 토글이 직접 처리하게 둡니다.
    const events = ['pointerdown', 'touchstart', 'keydown', 'scroll']
    const cleanup = () =>
      events.forEach((ev) => window.removeEventListener(ev, onFirst))
    function onFirst(e) {
      if (e.target?.closest?.('.bgm-toggle')) return
      play()
      cleanup()
    }
    events.forEach((ev) =>
      window.addEventListener(ev, onFirst, { passive: true }),
    )
    return cleanup
  }, [bgm.enabled])

  if (!bgm.enabled) return null

  const src = `${import.meta.env.BASE_URL}bgm/${bgm.file}`

  const toggle = () => {
    const audio = ref.current
    if (!audio) return
    if (audio.paused) {
      audio
        .play()
        .then(() => {
          startedRef.current = true
          setPlaying(true)
        })
        .catch(() => setPlaying(false))
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
        {/* 켜져 있으면 춤추고, 꺼져 있으면 멈춰 선다.
            둘 다 깔아 두고 투명도만 바꾸는 이유는, src 를 갈아끼우면 켤 때마다
            움직이는 판을 그제서야 내려받느라 버튼이 한 번 비기 때문이다. */}
        <img
          className="bgm-toggle__icon bgm-toggle__icon--on"
          src={dancing}
          alt=""
          aria-hidden="true"
        />
        <img
          className="bgm-toggle__icon bgm-toggle__icon--off"
          src={still}
          alt=""
          aria-hidden="true"
        />
      </button>
    </>
  )
}
