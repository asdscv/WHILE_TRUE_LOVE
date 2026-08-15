import { useEffect, useState } from 'react'
import { config } from '../config'
import { introImage } from '../intro'

// 첫 화면(스플래시): 전체화면 사진 + 한글 문구.
// duration(ms) 후 자동으로, 또는 탭하면 즉시 본문으로 전환됩니다.
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
    <div
      className={`intro ${leaving ? 'intro--out' : ''}`}
      style={{ '--intro-fade': `${fadeMs}ms` }}
      onClick={() => setLeaving(true)}
      role="button"
      aria-label="청첩장 열기"
    >
      <div className="intro__card">
        <div
          className="intro__photo"
          style={{ backgroundImage: `url(${introImage})` }}
        />
        <span className="intro__chevron" aria-hidden="true" />
      </div>
    </div>
  )
}
