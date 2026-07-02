import { config } from '../config'
import Reveal from './Reveal'

// 텍스트 전용 대형 인용구 (여백 북마크)
export default function Pullquote({ text }) {
  const t = text || config.photoQuote2
  if (!t) return null
  return (
    <section className="pullquote">
      <Reveal>
        <p className="pullquote__mark" aria-hidden="true">
          “
        </p>
        <p className="pullquote__text">{t}</p>
      </Reveal>
    </section>
  )
}
