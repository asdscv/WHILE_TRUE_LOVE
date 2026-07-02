import { config } from '../config'
import Reveal from './Reveal'

export default function Greeting() {
  const { greeting, groom, bride, groomFirst } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]

  return (
    <section className="section greeting">
      <Reveal>
        <p className="section__eng">INVITATION</p>
        <h2 className="section__title">{greeting.title}</h2>
      </Reveal>

      <Reveal delay={100}>
        <p className="greeting__text">{greeting.message}</p>
      </Reveal>

      <Reveal delay={200}>
        <div className="greeting__parents">
          <p>
            <span className="greeting__names">
              {a.father} · {a.mother}
            </span>
            <span className="greeting__rel">의 {a.label}</span>
            <b>{a.name}</b>
          </p>
          <p>
            <span className="greeting__names">
              {b.father} · {b.mother}
            </span>
            <span className="greeting__rel">의 {b.label}</span>
            <b>{b.name}</b>
          </p>
        </div>
      </Reveal>

      <Reveal delay={300}>
        <div className="greeting__contact">
          <a className="contact-btn" href={`tel:${groom.phone}`}>
            📞 신랑에게 연락하기
          </a>
          <a className="contact-btn" href={`tel:${bride.phone}`}>
            📞 신부에게 연락하기
          </a>
        </div>
      </Reveal>
    </section>
  )
}
