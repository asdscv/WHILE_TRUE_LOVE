import { useEffect, useState } from 'react'
import { config } from '../config'
import { introVideo, introPoster } from '../intro'

// 첫 화면(스플래시): 전체화면 영상.
// duration(ms) 후 자동으로만 본문으로 전환됩니다 — 건너뛸 방법은 두지 않습니다.
// duration 은 영상 길이 + 200ms 로 잡혀 있어(config.intro), 영상이 끝까지 재생되고
// 마지막 프레임이 잠깐 머문 뒤 페이드가 시작됩니다.
export default function Intro({ onDone }) {
  const { intro } = config
  const fadeMs = intro.fadeMs ?? 1200
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setLeaving(true), intro.duration)
    return () => clearTimeout(t)
  }, [intro.duration])

  // 페이드가 끝난 뒤에 걷어낸다. 전환 시간은 --intro-fade 로 CSS 에 그대로 넘겨
  // 두 값이 어긋나지 않게 한다.
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => {
      document.body.style.overflow = ''
      onDone()
    }, fadeMs)
    return () => clearTimeout(t)
  }, [leaving, onDone, fadeMs])

  return (
    // 탭해도 넘어가지 않는다. 영상을 끝까지 보여주는 것이 목적이라 onClick 도,
    // 탭을 유도하던 아래쪽 화살표도 두지 않는다(눌러도 아무 일이 없으면 더 답답하다).
    // 영상이 못 뜨더라도 위 타이머는 그대로 돌아 5초 뒤 반드시 걷힌다.
    <div
      className={`intro ${leaving ? 'intro--out' : ''}`}
      style={{ '--intro-fade': `${fadeMs}ms` }}
    >
      <div className="intro__card">
        {/* 조작할 수 없는 영상: controls 를 주지 않고 pointer-events 도 꺼서
            일시정지·구간이동이 안 되고, 길게 눌러도 저장 메뉴가 뜨지 않는다.
            muted + playsInline 이 있어야 모바일에서 자동재생이 허용된다. */}
        <video
          className="intro__video"
          src={introVideo}
          poster={introPoster}
          autoPlay
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload noplaybackrate noremoteplayback"
          onContextMenu={(e) => e.preventDefault()}
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
