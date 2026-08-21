const ITEMS = [
  { id: 'location', label: '오시는길' },
  { id: 'rsvp', label: '참석여부', needsRsvp: true },
  { id: 'guestbook', label: '축하의 글' },
]

// 화면 하단 고정 바. 누르면 해당 섹션으로 부드럽게 이동한다.
// 홈 인디케이터 영역까지 바 배경이 덮도록 아래 여백을 env() 로 확보한다.
// 참석 여부 섹션이 없는 링크에서는 그 버튼도 함께 빠진다.
export default function BottomNav({ showRsvp }) {
  const items = ITEMS.filter((it) => !it.needsRsvp || showRsvp)
  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  return (
    <nav className="bottomnav" aria-label="바로가기">
      {items.map((it) => (
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
