import { useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'
import Folio from './Folio'
import mapImage from '../assets/map/map.webp'

const Pin = () => (
  <svg className="nav-btn__i" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2a7 7 0 0 0-7 7c0 5.1 6.3 12.4 6.6 12.7a.6.6 0 0 0 .9 0C12.7 21.4 19 14.1 19 9a7 7 0 0 0-7-7Zm0 9.6A2.6 2.6 0 1 1 12 6.4a2.6 2.6 0 0 1 0 5.2Z"
    />
  </svg>
)

export default function Location({ n }) {
  const { venue } = config.wedding
  const { transport } = config.location
  const [copied, setCopied] = useState(false)
  const { lat, lng, name, address } = venue

  const q = encodeURIComponent(name)
  // 지도는 손그림 약도 이미지로 보여주고, 길찾기는 아래 앱 링크로 넘긴다.
  const kakao = `https://map.kakao.com/link/to/${q},${lat},${lng}`
  const naver = venue.naverUrl || `https://map.naver.com/v5/search/${q}`
  const tmap = `tmap://route?goalname=${q}&goalx=${lng}&goaly=${lat}`

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard 미지원 시 무시 */
    }
  }

  return (
    <section className="section location" id="location">
      <Reveal>
        {/* 약도 그림에는 제목·주소가 들어 있지 않아(2026-08-23 교체) 섹션은
            폴리오 한 줄로 열고, 이름·주소는 아래 텍스트로만 보여준다. */}
        <Folio n={n} label="오시는 길" />

        <div className="location__venue">
          <div className="location__venue-text">
            <p className="location__name">
              {name} <span>{venue.hall}</span>
            </p>
            <p className="location__addr">{address}</p>
          </div>
          <div className="location__actions">
            <button className="btn-line" onClick={copyAddress}>
              {copied ? '✓' : <Pin />}
              {copied ? '복사됨' : '주소 복사'}
            </button>
            {venue.tel && (
              <a className="btn-line" href={`tel:${venue.tel}`}>
                전화하기
              </a>
            )}
          </div>
        </div>

        <div className="map">
          <img
            className="map__img"
            src={mapImage}
            alt={`${name} 약도 — ${address}. 3호선 안국역 2번 출구에서 재동초등학교·가회동주민센터 방면 도보 10분.`}
            width={977}
            height={868}
            loading="lazy"
          />
        </div>

        <div className="nav-buttons">
          <a className="nav-btn" href={naver} target="_blank" rel="noreferrer">
            <span className="nav-btn__i">N</span>
            네이버지도
          </a>
          <a className="nav-btn" href={kakao} target="_blank" rel="noreferrer">
            <Pin />
            카카오맵
          </a>
          <a className="nav-btn" href={tmap}>
            <span className="nav-btn__i">T</span>
            티맵
          </a>
        </div>

        <ul className="transport">
          {transport.map((t, i) => (
            <li key={i}>
              <span className="transport__icon">{t.icon}</span>
              <span className="transport__title">{t.title}</span>
              <span className="transport__desc">{t.desc}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
