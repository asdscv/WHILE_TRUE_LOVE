import { useState } from 'react'
import { config } from '../config'
import Reveal from './Reveal'

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
  const [open, setOpen] = useState(false)
  return (
    <div className={`accordion ${open ? 'accordion--open' : ''}`}>
      <button className="accordion__head" onClick={() => setOpen((o) => !o)}>
        {title}
        <span className="accordion__arrow">{open ? '−' : '+'}</span>
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
        <h2 className="section__title">마음 전하실 곳</h2>
        <p className="account__desc">
          축하의 마음을 전하고 싶으신 분들을 위해
          <br />
          계좌번호를 안내드립니다.
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="account__groups">
          {groups.map(([title, rows]) => (
            <AccordionGroup key={title} title={title} rows={rows} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
