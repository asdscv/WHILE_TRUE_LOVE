import { config } from '../config'
import { galleryImages } from '../gallery'

// 본문 중간의 풀사이즈 사진 밴드 + 문구 (매거진 감성 분리대)
export default function PhotoBand() {
  const img = galleryImages[2] || galleryImages[0]
  if (!config.photoQuote) return null
  return (
    <section
      className="photoband"
      style={{ backgroundImage: `url(${img})` }}
      aria-label="사진"
    >
      <div className="photoband__overlay" />
      <p className="photoband__quote">{config.photoQuote}</p>
    </section>
  )
}
