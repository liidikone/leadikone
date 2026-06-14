import { useState } from 'react'
import '../styles/Hero.css'

export default function Hero() {
  const [open, setOpen] = useState(false)

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img
          src="/leadikone-bg.avif"
          alt=""
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">
          SOMESANKARIT<br />
          <span className="hero__title-glow">→LIIDIKONE</span>
        </h1>
        <p className="hero__lead">
          Muuta näyttökerrat rahaksi
        </p>
      </div>

      <div className="hero__powered-group">
        {/* synabs.png — aukeaa animaatiolla ylös */}
        <img
          src="/synabs.png"
          alt="Synabs"
          className={`hero__powered-logo${open ? ' is-open' : ''}`}
        />

        {/* Nappi + Kysymyksiä? leijuu napin päällä */}
        <div className="hero__powered-btn-wrap">
          <p className={`hero__powered-label${open ? ' is-hidden' : ''}`}>
            Kysymyksiä?<br />AI agentti vastaa
          </p>
          <button
            className={`hero__powered${open ? ' is-open' : ''}`}
            onClick={() => setOpen(v => !v)}
          >
            <span className="hero__powered-arrow">{open ? '▼' : '▲'}</span>
            {open ? 'Sulje' : 'Juttele itsestään kehittyvän AI agentin kanssa'}
          </button>
        </div>
      </div>
    </section>
  )
}
