// 낙관 도장 (한국 감성 악센트). 기본 문자는 囍(쌍희, 결혼 상징).
export default function Seal({ char = '囍', paper = false }) {
  return (
    <span className={`seal ${paper ? 'seal--paper' : ''}`} aria-hidden="true">
      {char}
    </span>
  )
}
