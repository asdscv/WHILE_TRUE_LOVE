import { useEffect, useState } from 'react'
import { config } from './config'
import { useAccountVisible } from './lib/useAccountVisible'
import { setThemeColor } from './lib/themeColor'
import Bgm from './components/Bgm'
import Intro from './components/Intro'
import Cover from './components/Cover'
import Greeting from './components/Greeting'
import CalendarDday from './components/CalendarDday'
import SaveTheDate from './components/SaveTheDate'
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

  return (
    <div className="app">
      <Bgm />
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <div className={`frame ${introDone ? 'frame--in' : ''}`}>
        <Cover />
        <Greeting />
        <CalendarDday />
        <SaveTheDate />
        <Location />
        {accountVisible && <Account />}
        <Guestbook />
        <Gallery />

        <footer className="footer">
          <img
            className="footer__img"
            src={footerImage}
            alt={`${a.name} · ${b.name} — ${config.wedding.dateText}. ${config.footer.message}`}
          />
        </footer>
      </div>

      <BottomNav />
      <RsvpPopup active={introDone} />

      <DevVariantToggle
        visible={accountVisible}
        setVisible={setAccountVisible}
      />
    </div>
  )
}
