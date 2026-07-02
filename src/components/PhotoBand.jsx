import { galleryImages } from '../gallery'

// 본문 중간의 풀사이즈 사진 밴드 + 문구 (매거진 감성 분리대)
export default function PhotoBand({ quote, index = 2 }) {
  if (!quote) return null
  const img = galleryImages[index] || galleryImages[galleryImages.length - 1]
  return (
    <section
      className="photoband"
      style={{ backgroundImage: `url(${img})` }}
      aria-label="사진"
    >
      <div className="photoband__overlay" />
      <p className="photoband__quote">{quote}</p>
    </section>
  )
}
