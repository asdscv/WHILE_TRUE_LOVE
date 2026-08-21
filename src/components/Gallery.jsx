import { useCallback, useEffect, useState } from 'react'
import Reveal from './Reveal'
import Folio from './Folio'
import { galleryImages, galleryThumbs } from '../gallery'

// 격자에 까는 장수. 3열이라 8장 + "전체 보기" 칸 = 딱 3줄(3×3)로 떨어진다.
const PREVIEW = 8

export default function Gallery({ n }) {
  const [index, setIndex] = useState(null) // null = 닫힘
  const open = index !== null

  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length),
    [],
  )
  const next = useCallback(
    () => setIndex((i) => (i + 1) % galleryImages.length),
    [],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close, prev, next])

  if (galleryImages.length === 0) return null

  // 격자는 늘 3×3 그대로 둔다. 8장을 깔고 9번째 칸은 남은 장수를 얹어,
  // 누르면 격자를 늘리는 대신 9번째 사진부터 크게 띄운다(나머지는 넘겨서 본다).
  // 사진이 9장 이하라 더보기 칸이 무의미하면 그냥 전부 깐다.
  const hasMore = galleryThumbs.length > PREVIEW + 1
  const shown = hasMore ? galleryThumbs.slice(0, PREVIEW) : galleryThumbs
  const restCount = galleryThumbs.length - PREVIEW

  return (
    <section className="section gallery">
      <Reveal>
        <Folio n={n} label="사진" />
        <h2 className="section__title">사진첩</h2>
        <p className="section__sub">우리의 순간들</p>
      </Reveal>

      <Reveal delay={100}>
        <div className="gallery__grid">
          {shown.map((src, i) => (
            <button
              key={i}
              className="gallery__item"
              onClick={() => setIndex(i)}
              aria-label={`사진 ${i + 1} 크게 보기`}
            >
              <img src={src} alt={`웨딩 사진 ${i + 1}`} loading="lazy" />
            </button>
          ))}

          {hasMore && (
            <button
              className="gallery__item gallery__more"
              onClick={() => setIndex(PREVIEW)}
              aria-label={`나머지 사진 ${restCount}장 크게 보기`}
            >
              <img
                src={galleryThumbs[PREVIEW]}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <span className="gallery__more-label">
                <b>+{restCount}</b>
              </span>
            </button>
          )}
        </div>
      </Reveal>

      {open && (
        <div className="lightbox" onClick={close}>
          <button className="lightbox__close" onClick={close} aria-label="닫기">
            ✕
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="이전 사진"
          >
            ‹
          </button>
          <img
            className="lightbox__img"
            src={galleryImages[index]}
            alt={`웨딩 사진 ${index + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lightbox__nav lightbox__nav--next"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="다음 사진"
          >
            ›
          </button>
          <div className="lightbox__count">
            {index + 1} / {galleryImages.length}
          </div>
        </div>
      )}
    </section>
  )
}
