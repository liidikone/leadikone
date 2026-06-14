import { useState, useEffect, useRef } from 'react'
import '../styles/Hero.css'

export default function Hero() {
  const [open, setOpen] = useState(false)
  const [badge, setBadge] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => setBadge(true), 6000)
    return () => clearTimeout(timerRef.current)
  }, [])

  function handleOpen() {
    const next = !open
    setOpen(next)
    if (next) {
      setBadge(false)
      clearTimeout(timerRef.current)
    }
  }

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img src="/leadikone-bg.avif" alt="" loading="eager" fetchPriority="high" />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">
          SOMESANKARIT<br />
          <span className="hero__title-glow">→LIIDIKONE</span>
        </h1>
        <p className="hero__lead">Muuta näyttökerrat rahaksi</p>
      </div>

      <div className="hero__powered-group">
        <p className={`hero__powered-logo hero__powered-tagline${open ? ' is-open' : ''}`}>
          <em>Yhteistyössä SYNABS.fi:n seuraavan sukupolven tuloksia tuottavien tekoälyagenttien kanssa.</em>
        </p>
        <div className="hero__powered-btn-wrap">
          <p className={`hero__powered-label${open ? ' is-hidden' : ''}`}>
            Kysymyksiä?<br />AI agentti vastaa
          </p>
          <button
            className={`hero__powered${open ? ' is-open' : ''}`}
            onClick={handleOpen}
          >
            <span className="hero__powered-arrow">{open ? '▼' : '▲'}</span>
            {open ? 'Sulje' : 'Juttele itsestään kehittyvän AI agentin kanssa'}
            {badge && !open && <span className="hero__powered-badge">1</span>}
          </button>
        </div>
      </div>
    </section>
  )
}
