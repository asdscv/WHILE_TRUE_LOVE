import { coverImage } from '../cover'
import { config } from '../config'

// 전환 후 첫 화면(표지). 완성 시안 이미지를 잘리는 곳 없이 폭에 맞춰 통째로 보여준다.
// (화면을 꽉 채우는 background-size:cover 를 쓰면 좌우가 잘려 가장자리 이름이 사라진다)
export default function Cover() {
  const { groom, bride, groomFirst, wedding } = config
  const [a, b] = groomFirst ? [groom, bride] : [bride, groom]
  return (
    <header className="cover">
      <img
        className="cover__img"
        src={coverImage}
        alt={`${a.name} · ${b.name} — ${wedding.dateText} ${wedding.timeText}, ${wedding.venue.name}`}
      />
    </header>
  )
}
