import { useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'
import Collapsible from './Collapsible'
import branch from '../assets/sections/branch.webp'

function AccountRow({ row }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(row.number.replace(/\s/g, ''))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* 무시 */
    }
  }
  return (
    <div className="account-row">
      <div className="account-row__info">
        <p className="account-row__top">
          <span className="account-row__bank">{row.bank}</span>
          <span className="account-row__rel">{row.relation}</span>
        </p>
        <p className="account-row__num">{row.number}</p>
        <p className="account-row__holder">예금주 {row.name}</p>
      </div>
      <div className="account-row__actions">
        <button className="copy-btn" onClick={copy}>
          {copied ? '복사됨' : '복사'}
        </button>
        {row.kakaopay && (
          <a
            className="kakaopay-btn"
            href={row.kakaopay}
            target="_blank"
            rel="noreferrer"
          >
            송금
          </a>
        )}
      </div>
    </div>
  )
}

function AccordionGroup({ title, rows }) {
  // 계좌는 기본 접힘 — 열어보는 사람만 보도록.
  const [open, setOpen] = useState(false)
  return (
    <div className={`accordion ${open ? 'accordion--open' : ''}`}>
      <button
        type="button"
        className="accordion__head"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="accordion__i" aria-hidden="true">
          <img src={branch} alt="" />
        </span>
        <span className="accordion__title">{title}</span>
        <span className="accordion__arrow" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div className="accordion__body">
          {rows.map((row, i) => (
            <AccountRow key={i} row={row} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Account() {
  const { groom, bride } = config.account
  const { groomFirst } = config
  const groups = groomFirst
    ? [
        ['신랑측 마음 전하실 곳', groom],
        ['신부측 마음 전하실 곳', bride],
      ]
    : [
        ['신부측 마음 전하실 곳', bride],
        ['신랑측 마음 전하실 곳', groom],
      ]

  return (
    <section className="section account">
      <Reveal>
        <Collapsible n="04" label="마음" title="마음 전하실 곳">
          <p className="account__desc">
            소중한 마음을 전해주시면
            <br />
            기쁨과 감사한 마음 잊지 않고 간직하겠습니다.
          </p>
          <div className="account__groups">
            {groups.map(([title, rows]) => (
              <AccordionGroup key={title} title={title} rows={rows} />
            ))}
          </div>
        </Collapsible>
      </Reveal>
    </section>
  )
}
