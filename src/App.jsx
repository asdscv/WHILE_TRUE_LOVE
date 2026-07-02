import { useState } from 'react'
import { config } from './config'
import { useAccountVisible } from './lib/useAccountVisible'
import Bgm from './components/Bgm'
import Intro from './components/Intro'
import Cover from './components/Cover'
import Greeting from './components/Greeting'
import PhotoBand from './components/PhotoBand'
import CalendarDday from './components/CalendarDday'
import Location from './components/Location'
import Account from './components/Account'
import Guestbook from './components/Guestbook'
import Gallery from './components/Gallery'
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
        <PhotoBand quote={config.photoQuote} index={2} />
        <CalendarDday />
        <Location />
        <PhotoBand quote={config.photoQuote2} index={5} />
        {accountVisible && <Account />}
        <Guestbook />
        <Gallery />

        <footer className="footer">
          <p className="footer__names">
            {a.name} · {b.name}
          </p>
          <p className="footer__date">{config.wedding.dateText}</p>
          <p className="footer__thanks">감사합니다</p>
        </footer>
      </div>

      <DevVariantToggle
        visible={accountVisible}
        setVisible={setAccountVisible}
      />
    </div>
  )
}
