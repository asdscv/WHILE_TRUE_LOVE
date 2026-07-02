import { coverImage } from '../cover'

// 전환 후 첫 화면(표지). 완성 시안 이미지를 전체화면으로 표시합니다.
export default function Cover() {
  return (
    <header className="cover">
      <div
        className="cover__photo"
        style={{ backgroundImage: `url(${coverImage})` }}
        role="img"
        aria-label="메인 사진"
      />
      <div className="cover__scroll" aria-hidden="true">
        <span />
      </div>
    </header>
  )
}
