import { config } from '../config'
import Reveal from './Reveal'
import inviteImage from '../assets/sections/01-invite.webp'

// 01 · 초대 — 한 장의 이미지로 완성된 섹션.
// 문구·혼주 표기까지 이미지에 포함되어 있으므로 내용을 바꾸려면
// src/assets/sections/01-invite.webp 를 교체해야 합니다.
export default function Greeting() {
  const { greeting, groom, bride, groomFirst } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]

  return (
    <section className="section greeting">
      <Reveal>
        <img
          className="greeting__img"
          src={inviteImage}
          width={899}
          height={1748}
          alt={`${greeting.title} — ${greeting.lead.replace(/\n/g, ' ')}. ${greeting.message.replace(/\n+/g, ' ')} ${a.father} · ${a.mother}의 ${a.label} ${a.name}, ${b.father} · ${b.mother}의 ${b.label} ${b.name}`}
        />
      </Reveal>
    </section>
  )
}
