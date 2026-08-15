const ITEMS = [
  { id: 'rsvp', label: '참석여부' },
  { id: 'location', label: '오시는길' },
  { id: 'guestbook', label: '축하의 글' },
]

// 화면 하단 고정 바. 누르면 해당 섹션으로 부드럽게 이동한다.
// (세이프에어리어 여백 없이 화면 맨 아래에 붙인다 — 요청사항)
export default function BottomNav() {
  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <nav className="bottomnav" aria-label="바로가기">
      {ITEMS.map((it) => (
        <button
          key={it.id}
          type="button"
          className="bottomnav__btn"
          onClick={() => go(it.id)}
        >
          {it.label}
        </button>
      ))}
    </nav>
  )
}
