import { config } from '../config'
import { galleryImages } from '../gallery'
import Seal from './Seal'

function ymd(iso) {
  const [d] = iso.split('T')
  const [y, m, dd] = d.split('-')
  return { y, m: Number(m), d: Number(dd) }
}

export default function Cover() {
  const { groom, bride, groomFirst, wedding } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]
  const cover = galleryImages[0]
  const { y, m, d } = ymd(wedding.dateISO)
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <header className="cover">
      <div
        className="cover__photo"
        style={{ backgroundImage: `url(${cover})` }}
        role="img"
        aria-label="메인 사진"
      />
      <div className="cover__overlay" />

      <div className="cover__mark">
        <Seal />
      </div>

      <div className="cover__masthead">
        <p className="cover__eyebrow">우리 결혼합니다</p>
        <h1 className="cover__title">
          <span className="cover__nm">{a.name}</span>
          <span className="cover__amp">&amp;</span>
          <span className="cover__nm">{b.name}</span>
        </h1>
        <div className="cover__issue">
          <span>
            {wedding.timeText} · {wedding.venue.name}
          </span>
          <span className="num">
            {y} · {pad(m)} · {pad(d)}
          </span>
        </div>
      </div>

      <div className="cover__foot">
        <p className="cover__venue">{wedding.dateText}</p>
        <div className="cover__scroll" aria-hidden="true">
          <span />
        </div>
      </div>
    </header>
  )
}
