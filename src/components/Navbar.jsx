import { useState } from 'react'
import { createPortal } from 'react-dom'
import '../styles/Navbar.css'

const navLinks = [
  { href: '#palvelut', label: 'Palvelut' },
  { href: '#tiimi',    label: 'Tiimi' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [callOpen, setCallOpen] = useState(false)
  const toggleMenu = () => setMenuOpen(prev => !prev)
  const closeMenu  = () => setMenuOpen(false)

  function handleAnchor(e, href) {
    e.preventDefault()
    closeMenu()
    const target = document.querySelector(href)
    if (target) {
      const navHeight = 80
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const navClass = [
    'navbar',
    menuOpen ? 'navbar--menu-open' : '',
  ].filter(Boolean).join(' ')

  const navbar = (
    <>
      <nav className={navClass} id="navbar">
        <div className="navbar__inner">

          <a href="#" className="navbar__logo" aria-label="Home" onClick={e => handleAnchor(e, '#hero')}>
            <img src="/logo.avif" alt="Logo" className="navbar__logo-img" />
          </a>

          <div className="navbar__right">
            <nav className="navbar__nav" aria-label="Päävalikko">
              <ul className="navbar__list">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="navbar__link" onClick={e => handleAnchor(e, href)}>{label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="navbar__ctas">
              <button className="navbar__cta-btn" onClick={() => setCallOpen(true)}>
                Soita
              </button>
            </div>
          </div>

          <button
            className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
            onClick={toggleMenu}
            aria-label="Avaa valikko"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <div
          className={`navbar__mobile-menu${menuOpen ? ' navbar__mobile-menu--open' : ''}`}
          id="mobile-menu"
          role="dialog"
          aria-label="Mobiilinavigaatio"
        >
          <ul className="navbar__mobile-list">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={href} className="navbar__mobile-link" onClick={e => handleAnchor(e, href)}>{label}</a>
              </li>
            ))}
            <li>
              <button className="navbar__mobile-link navbar__mobile-link--cta" onClick={() => { closeMenu(); setCallOpen(true) }}>
                Soita
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {callOpen && (
        <div className="hero__call-overlay" onClick={() => setCallOpen(false)}>
          <div className="hero__call-box" onClick={e => e.stopPropagation()}>
            <p className="hero__call-label">Soita meille</p>
            <a href="tel:0501233455" className="hero__call-number">050 123 345 5</a>
            <button className="hero__call-close" onClick={() => setCallOpen(false)}>✕</button>
          </div>
        </div>
      )}
    </>
  )

  return createPortal(navbar, document.body)
}
