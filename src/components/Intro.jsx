import { useEffect, useState } from 'react'
import { config } from '../config'
import { introImage } from '../intro'

// 첫 화면(스플래시): 전체화면 사진 + 한글 문구.
// duration(ms) 후 자동으로, 또는 탭하면 즉시 본문으로 전환됩니다.
export default function Intro({ onDone }) {
  const { intro } = config
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setLeaving(true), intro.duration)
    return () => clearTimeout(t)
  }, [intro.duration])

  useEffect(() => {
    if (!leaving) return
    const t = setTimeout(() => {
      document.body.style.overflow = ''
      onDone()
    }, 1100)
    return () => clearTimeout(t)
  }, [leaving, onDone])

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
          <p className="intro__phrase">{intro.phrase}</p>
          <span className="intro__rule" />
          <p className="intro__date">{intro.dateText}</p>
        </div>
        <span className="intro__chevron" aria-hidden="true" />
      </div>
    </div>
  )
}
