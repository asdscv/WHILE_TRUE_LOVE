import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Attendant from './components/Attendant.jsx'
import { lockZoom } from './lib/noZoom'

// /attendant 는 참석 명단(비밀번호 보호) 화면, 그 외는 청첩장 본문.
const isAttendant = window.location.pathname.replace(/\/+$/, '') === '/attendant'

if (!isAttendant) lockZoom()

createRoot(document.getElementById('root')).render(
  <StrictMode>{isAttendant ? <Attendant /> : <App />}</StrictMode>,
)
