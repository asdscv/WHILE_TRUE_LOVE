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

      <div className="cover__top">
        <p className="cover__eng">THE WEDDING OF</p>
      </div>

      <div className="cover__inner">
        <div className="cover__names">
          <span className="cover__name">{a.name}</span>
          <span className="cover__amp">&amp;</span>
          <span className="cover__name">{b.name}</span>
        </div>
        <span className="cover__rule" />
        <p className="cover__date">
          {wedding.dateText.replace(/\s?\S+요일$/, '')} · {wedding.timeText}
        </p>
        <p className="cover__venue">
          {wedding.venue.name}
          {wedding.venue.hall ? ` ${wedding.venue.hall}` : ''}
        </p>
      </div>

      <div className="cover__scroll" aria-hidden="true">
        <span />
      </div>
    </header>
  )
}
