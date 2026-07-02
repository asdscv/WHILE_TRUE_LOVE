import { useState } from 'react'
import { config } from './config'
import { useAccountVisible } from './lib/useAccountVisible'
import Bgm from './components/Bgm'
import Intro from './components/Intro'
import Cover from './components/Cover'
import Greeting from './components/Greeting'
import CalendarDday from './components/CalendarDday'
import Gallery from './components/Gallery'
import Location from './components/Location'
import Account from './components/Account'
import Guestbook from './components/Guestbook'
import DevVariantToggle from './components/DevVariantToggle'

export default function App() {
  const [accountVisible, setAccountVisible] = useAccountVisible()
  const [introDone, setIntroDone] = useState(
    () =>
      !config.intro.enabled ||
      new URLSearchParams(window.location.search).get('intro') === 'off',
  )

  return (
    <div className="app">
      <Bgm />
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <div className={`frame ${introDone ? 'frame--in' : ''}`}>
        <Cover />
        <Greeting />
        <CalendarDday />
        <Gallery />
        <Location />
        {accountVisible && <Account />}
        <Guestbook />

        <footer className="footer">
          <p className="footer__names">
            {config.groom.name} &amp; {config.bride.name}
          </p>
          <p className="footer__date">{config.wedding.dateText}</p>
          <p className="footer__credit">WHILE_TRUE_LOVE ♥</p>
        </footer>
      </div>

      <DevVariantToggle
        visible={accountVisible}
        setVisible={setAccountVisible}
      />
    </div>
  )
}
