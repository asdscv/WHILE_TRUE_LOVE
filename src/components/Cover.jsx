import { config } from '../config'
import { galleryImages } from '../gallery'

export default function Cover() {
  const { groom, bride, groomFirst, wedding } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]
  const cover = galleryImages[0]

  return (
    <header className="cover">
      <div
        className="cover__photo"
        style={{ backgroundImage: `url(${cover})` }}
        role="img"
        aria-label="메인 사진"
      />
      <div className="cover__overlay" />
      <div className="cover__inner">
        <p className="cover__eng">THE MARRIAGE OF</p>
        <h1 className="cover__names">
          <span>{a.name}</span>
          <span className="cover__amp">&amp;</span>
          <span>{b.name}</span>
        </h1>
        <p className="cover__date">
          {wedding.dateText} · {wedding.timeText}
        </p>
        <p className="cover__venue">
          {wedding.venue.name} {wedding.venue.hall}
        </p>
      </div>
      <div className="cover__scroll" aria-hidden="true">
        <span />
      </div>
    </header>
  )
}
