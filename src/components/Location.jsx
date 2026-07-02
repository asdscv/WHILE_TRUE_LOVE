import { useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'
import Collapsible from './Collapsible'

export default function Location() {
  const { venue } = config.wedding
  const { transport } = config.location
  const [copied, setCopied] = useState(false)
  const { lat, lng, name, address } = venue

  const q = encodeURIComponent(name)
  // 키가 필요 없는 지도/길찾기 링크들
  const mapEmbed = `https://maps.google.com/maps?q=${lat},${lng}&z=16&hl=ko&output=embed`
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
    <section className="section location">
      <Reveal>
        <Collapsible n="03" label="오시는 길" title="오시는 길">
          <div className="location__venue">
            <p className="location__name">
              {name} <span>{venue.hall}</span>
            </p>
            <p className="location__addr">{address}</p>
            <div className="location__actions">
              <button className="btn-line" onClick={copyAddress}>
                {copied ? '✓ 복사됨' : '주소 복사'}
              </button>
              {venue.tel && (
                <a className="btn-line" href={`tel:${venue.tel}`}>
                  전화하기
                </a>
              )}
            </div>
          </div>

          <div className="map">
            <iframe
              title="예식장 위치"
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="nav-buttons">
            <a
              className="nav-btn nav-btn--primary"
              href={naver}
              target="_blank"
              rel="noreferrer"
            >
              네이버지도
            </a>
            <a className="nav-btn" href={kakao} target="_blank" rel="noreferrer">
              카카오맵
            </a>
            <a className="nav-btn" href={tmap}>
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
        </Collapsible>
      </Reveal>
    </section>
  )
}
