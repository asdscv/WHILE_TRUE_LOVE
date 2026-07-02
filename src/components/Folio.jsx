// 매거진 폴리오 (번호 · 한글 라벨 + 헤어라인)
export default function Folio({ n, label }) {
  return (
    <p className="folio">
      <span className="folio__n">{n}</span>
      <span className="folio__sep">·</span>
      <span className="folio__label">{label}</span>
    </p>
  )
}
