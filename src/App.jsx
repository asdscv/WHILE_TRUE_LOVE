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

  // 인트로 → 표지로 넘어갈 때 상태표시줄 색도 각 사진 상단색으로 맞춘다.
  useEffect(() => {
    setThemeColor(
      introDone ? config.themeColor.cover : config.themeColor.intro,
    )
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
