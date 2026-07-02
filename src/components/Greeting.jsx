import { config } from '../config'
import { galleryImages } from '../gallery'
import Reveal from './Reveal'
import Folio from './Folio'

export default function Greeting() {
  const { greeting, groom, bride, groomFirst } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]
  const accent = galleryImages[1] || galleryImages[0]

  return (
    <section className="section greeting">
      <Reveal>
        <Folio n="01" label="초대" />
        <h2 className="section__title">{greeting.title}</h2>
      </Reveal>

      {greeting.lead && (
        <Reveal delay={60}>
          <p className="greeting__lead">{greeting.lead}</p>
        </Reveal>
      )}

      <Reveal delay={80}>
        <figure className="greeting__figure">
          <img src={accent} alt="" loading="lazy" />
          <figcaption>
            {a.name} · {b.name}
          </figcaption>
        </figure>
      </Reveal>

      <Reveal delay={140}>
        <p className="greeting__text">{greeting.message}</p>
      </Reveal>

      <Reveal delay={200}>
        <div className="greeting__parents">
          <p>
            <span className="greeting__rel">
              {a.father} · {a.mother}
            </span>
            <span className="greeting__of">의 {a.label}</span>
            <b>{a.name}</b>
          </p>
          <p>
            <span className="greeting__rel">
              {b.father} · {b.mother}
            </span>
            <span className="greeting__of">의 {b.label}</span>
            <b>{b.name}</b>
          </p>
        </div>
      </Reveal>

      <Reveal delay={260}>
        <div className="greeting__contact">
          <a className="contact-btn" href={`tel:${groom.phone}`}>
            신랑에게 연락하기
          </a>
          <a className="contact-btn" href={`tel:${bride.phone}`}>
            신부에게 연락하기
          </a>
        </div>
      </Reveal>
    </section>
  )
}
