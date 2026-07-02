// 개발 중에만 보이는 미리보기 토글 (배포본에는 나타나지 않습니다).
// "계좌 있는 버전 / 없는 버전"을 딸깍으로 전환해 확인할 수 있습니다.
export default function DevVariantToggle({ visible, setVisible }) {
  if (!import.meta.env.DEV) return null
  return (
    <div className="dev-toggle">
      <span className="dev-toggle__label">미리보기</span>
      <button
        className={!visible ? 'active' : ''}
        onClick={() => setVisible(false)}
      >
        계좌 없음
      </button>
      <button
        className={visible ? 'active' : ''}
        onClick={() => setVisible(true)}
      >
        계좌 있음
      </button>
    </div>
  )
}
