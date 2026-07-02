import { useEffect, useState } from 'react'
import { config } from '../config'
import { introImage } from '../intro'

// 첫 화면(스플래시): 전체화면 사진 + 감각적인 타이포.
// duration(ms) 후 자동으로, 또는 탭하면 즉시 본문으로 전환됩니다.
export default function Intro({ onDone }) {
  const { intro } = config
  const [leaving, setLeaving] = useState(false)

  // 자동 전환 타이머
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setLeaving(true), intro.duration)
    return () => clearTimeout(t)
  }, [intro.duration])

  // 퇴장 애니메이션 후 언마운트
  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => {
      document.body.style.overflow = ''
      onDone()
    }, 1100)
    return () => clearTimeout(t)
  }, [leaving, onDone])

  const caption =
    intro.caption || `${config.groom.name} · ${config.bride.name}`

  return (
    <div
      className={`intro ${leaving ? 'intro--out' : ''}`}
      onClick={() => setLeaving(true)}
      role="button"
      aria-label="청첩장 열기"
    >
      <div className="intro__card">
        <div
          className="intro__photo"
          style={{ backgroundImage: `url(${introImage})` }}
        />
        <div className="intro__overlay" />
        <div className="intro__inner">
          <p className="intro__script">{intro.scriptText}</p>
          <h1 className="intro__title">{intro.title}</h1>
          <p className="intro__caption">{caption}</p>
        </div>
        <span className="intro__hint">TAP TO ENTER</span>
      </div>
    </div>
  )
}
