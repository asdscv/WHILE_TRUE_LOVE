import { config } from '../config'
import { galleryImages } from '../gallery'

export default function Cover() {
  const { groom, bride, groomFirst, wedding } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]
  const cover = galleryImages[0]
  const dateNum = wedding.dateISO.split('T')[0].replace(/-/g, '. ')

  return (
    <header className="cover">
      <div
        className="cover__photo"
        style={{ backgroundImage: `url(${cover})` }}
        role="img"
        aria-label="메인 사진"
      />
      <div className="cover__overlay" />

      <div className="cover__center">
        <p className="cover__eyebrow">저희 결혼합니다</p>
        <h1 className="cover__title">
          {a.name} <span className="cover__amp">&amp;</span> {b.name}
        </h1>
        <p className="cover__date">{dateNum}</p>
      </div>

      <div className="cover__scroll" aria-hidden="true">
        <span />
      </div>
    </header>
  )
}
