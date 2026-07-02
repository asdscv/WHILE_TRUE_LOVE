import { useCallback, useEffect, useState } from 'react'
import Reveal from './Reveal'
import { galleryImages } from '../gallery'

export default function Gallery() {
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

  return (
    <section className="section gallery">
      <Reveal>
        <h2 className="section__title">사진첩</h2>
        <p className="section__sub">우리의 순간들</p>
      </Reveal>

      <Reveal delay={100}>
        <div className="gallery__grid">
          {galleryImages.map((src, i) => (
            <button
              key={i}
              className="gallery__item"
              onClick={() => setIndex(i)}
              aria-label={`사진 ${i + 1} 크게 보기`}
            >
              <img src={src} alt={`웨딩 사진 ${i + 1}`} loading="lazy" />
            </button>
          ))}
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
