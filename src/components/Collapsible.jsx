import { useState } from 'react'
import Folio from './Folio'

// 접었다 폈다 하는 섹션 (기본 접힘). 헤더(폴리오+제목+아이콘) 클릭으로 토글.
export default function Collapsible({ n, label, title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`collapse ${open ? 'collapse--open' : ''}`}>
      <button
        type="button"
        className="collapse__head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <Folio n={n} label={label} />
        <span className="collapse__bar">
          <span className="collapse__title">{title}</span>
          <span className="collapse__icon" aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </span>
      </button>
      {open && <div className="collapse__body">{children}</div>}
    </div>
  )
}
