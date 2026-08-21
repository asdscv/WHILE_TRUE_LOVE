import { useEffect, useState } from 'react'
import { config } from './config'
import { useAccountVisible } from './lib/useAccountVisible'
import { setThemeColor } from './lib/themeColor'
import Bgm from './components/Bgm'
import Intro from './components/Intro'
import Cover from './components/Cover'
import Greeting from './components/Greeting'
import CalendarDday from './components/CalendarDday'
import Location from './components/Location'
import Account from './components/Account'
import Guestbook from './components/Guestbook'
import Gallery from './components/Gallery'
import RsvpPopup from './components/RsvpPopup'
import BottomNav from './components/BottomNav'
import footerImage from './assets/sections/footer.webp'
import DevVariantToggle from './components/DevVariantToggle'

export default function App() {
  const [accountVisible, setAccountVisible] = useAccountVisible()
  const [introDone, setIntroDone] = useState(
    () =>
      !config.intro.enabled ||
      new URLSearchParams(window.location.search).get('intro') === 'off',
  )

  // iOS Safari 는 상태표시줄 뒤에 theme-color 로 가림막을 덮는다(페이지가 그 아래로
  // 깔려 있어도 보이지 않는다). 그래서 지금 화면 맨 위에 무엇이 있는지에 맞춰
  // 그 색을 계속 바꿔 준다 — 인트로 사진 → 표지 하늘 → 본문 지색.
  useEffect(() => {
    if (!introDone) {
      setThemeColor(config.themeColor.intro)
      return
    }
    const update = () => {
      const cover = document.querySelector('.cover')
      const pastCover = cover
        ? window.scrollY >= cover.offsetHeight - 4
        : true
      setThemeColor(
        pastCover ? config.themeColor.page : config.themeColor.cover,
      )
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [introDone])

  const [a, b] = config.groomFirst
    ? [config.groom, config.bride]
    : [config.bride, config.groom]

  // 계좌를 뺀 링크는 "결혼한다고 알리기만 하는" 소식용이라,
  // 축의금 계좌와 함께 참석 여부(섹션 · 첫 화면 팝업)도 같이 숨긴다.
  const rsvpVisible = accountVisible && config.rsvp.enabled
  const guestbookVisible = config.guestbook.enabled

  // 폴리오 번호는 "실제로 보이는 섹션"만 세어 매긴다.
  // (숨긴 섹션 자리에 번호가 비어 03 다음이 06 이 되는 일이 없도록.)
  let seq = 2 // 01 초대 · 02 예식은 언제나 보인다
  const nextFolio = () => String(++seq).padStart(2, '0')
  const folio = {
    location: nextFolio(),
    account: accountVisible ? nextFolio() : null,
    rsvp: rsvpVisible ? nextFolio() : null,
    guestbook: guestbookVisible ? nextFolio() : null,
    gallery: nextFolio(),
  }

  return (
    <div className="app">
      <Bgm />
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <div className={`frame ${introDone ? 'frame--in' : ''}`}>
        <Cover />
        <Greeting />
        <CalendarDday />
        <Location n={folio.location} />
        {accountVisible && <Account n={folio.account} />}
        <Guestbook
          showRsvp={rsvpVisible}
          rsvpN={folio.rsvp}
          guestbookN={folio.guestbook}
        />
        <Gallery n={folio.gallery} />

        <footer className="footer">
          <img
            className="footer__img"
            src={footerImage}
            alt={`${a.name} · ${b.name} — ${config.wedding.dateText}. ${config.footer.message}`}
          />
        </footer>
      </div>

      <BottomNav showRsvp={rsvpVisible} />
      {rsvpVisible && <RsvpPopup active={introDone} />}

      <DevVariantToggle
        visible={accountVisible}
        setVisible={setAccountVisible}
      />
    </div>
  )
}
