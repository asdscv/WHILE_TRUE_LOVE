import { config } from '../config'
import Reveal from './Reveal'

// 01·초대 이미지를 HTML/CSS 로 재현한 버전 (이미지와 비교용).
// 원본 이미지(899px 폭)의 글자 크기·자간·행간·여백·색을 실측해 옮긴 것이라
// 텍스트라서 문구·성함을 config 로 바로 고칠 수 있고 확대/축소도 자유롭다.
// 치수는 모두 --u(이미지 1px) 단위이며, 전체 배율은 src/index.css 의 --inv-scale 하나로 조절한다.
function Parent({ p }) {
  return (
    <p className="invite2__parent">
      <span className="invite2__rel">
        {p.fatherLate ? '故 ' : ''}
        {p.father} · {p.mother}
      </span>
      <span className="invite2__of">의 {p.label}</span>
      <b className="invite2__nm">{p.name}</b>
    </p>
  )
}

export default function GreetingText() {
  const { greeting, groom, bride, groomFirst } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]

  return (
    <section className="section invite2">
      <Reveal>
        <p className="invite2__folio">01 · 초대</p>
        <span className="invite2__rule-h" aria-hidden="true" />
        <h2 className="invite2__title">{greeting.title}</h2>
        <span className="invite2__dot" aria-hidden="true" />
        <p className="invite2__lead">{greeting.lead}</p>
        <span className="invite2__rule-v" aria-hidden="true" />
        <p className="invite2__msg">{greeting.message}</p>
        <div className="invite2__parents">
          <Parent p={a} />
          <Parent p={b} />
        </div>
      </Reveal>
    </section>
  )
}
