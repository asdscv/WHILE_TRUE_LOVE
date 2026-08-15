import { useState } from 'react'
import { config } from './config'
import { useAccountVisible } from './lib/useAccountVisible'
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
import branch from './assets/sections/branch.webp'
import DevVariantToggle from './components/DevVariantToggle'

export default function App() {
  const [accountVisible, setAccountVisible] = useAccountVisible()
  const [introDone, setIntroDone] = useState(
    () =>
      !config.intro.enabled ||
      new URLSearchParams(window.location.search).get('intro') === 'off',
  )

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
          <p className="footer__names">
            {a.name} · {b.name}
          </p>
          <p className="footer__date">{config.wedding.dateText}</p>
          <span className="footer__rule" aria-hidden="true" />
          <p className="footer__msg">{config.footer.message}</p>
          <div className="footer__branch" aria-hidden="true">
            <img src={branch} alt="" />
            <img src={branch} alt="" />
          </div>
          <span className="footer__end" aria-hidden="true" />
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
