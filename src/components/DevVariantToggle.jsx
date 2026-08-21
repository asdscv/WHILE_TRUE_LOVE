// "초대용(계좌·참석여부 포함) / 소식용(둘 다 없음)" 두 버전을 딸깍으로 전환하는
// 미리보기 토글.
// 개발 모드, 또는 배포된 사이트에서 URL 뒤에 ?preview 를 붙였을 때만 보입니다.
// (하객이 보는 일반 링크에는 나타나지 않습니다.)
export default function DevVariantToggle({ visible, setVisible }) {
  const enabled =
    import.meta.env.DEV ||
    (typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).has('preview'))
  if (!enabled) return null
  return (
    <div className="dev-toggle">
      <span className="dev-toggle__label">미리보기</span>
      <button
        className={!visible ? 'active' : ''}
        onClick={() => setVisible(false)}
      >
        소식용
      </button>
      <button
        className={visible ? 'active' : ''}
        onClick={() => setVisible(true)}
      >
        초대용
      </button>
    </div>
  )
}
