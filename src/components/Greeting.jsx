import { config } from '../config'
import Reveal from './Reveal'

// 01 · 초대 — 원본 시안 이미지(899px 폭)의 글자 크기·자간·행간·여백·색을 실측해
// HTML/CSS 로 옮긴 섹션. 텍스트라서 문구·성함을 config 로 바로 고칠 수 있다.
// 치수는 모두 --u(시안 1px) 단위이며, 전체 배율은 src/index.css 의 --inv-scale 하나로 조절한다.
function Parent({ p }) {
  return (
    <p className="invite__parent">
      <span className="invite__rel">
        {p.fatherLate ? '故 ' : ''}
        {p.father} · {p.mother}
      </span>
      <span className="invite__of">의 {p.label}</span>
      <b className="invite__nm">{p.name}</b>
    </p>
  )
}

export default function Greeting() {
  const { greeting, groom, bride, groomFirst } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]

  return (
    <section className="section invite">
      <Reveal>
        <p className="invite__folio">01 · 초대</p>
        <span className="invite__rule-h" aria-hidden="true" />
        <h2 className="invite__title">{greeting.title}</h2>
        <span className="invite__dot" aria-hidden="true" />
        <p className="invite__lead">{greeting.lead}</p>
        <span className="invite__rule-v" aria-hidden="true" />
        <p className="invite__msg">{greeting.message}</p>
        <div className="invite__parents">
          <Parent p={a} />
          <Parent p={b} />
        </div>
      </Reveal>
    </section>
  )
}
