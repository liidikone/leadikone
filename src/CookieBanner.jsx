import { useState, useEffect } from 'react'
import './CookieBanner.css'

const STORAGE_KEY = 'someton_cookies'
const GA_ID = 'G-1C7V0Z4MP4'
const CLARITY_ID = 'xcq3yxbhzx'

const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000 // 12 kuukautta

function getStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    // Jos valinnasta on yli 12kk, nollataan ja kysytään uudelleen
    if (!parsed.ts || Date.now() - parsed.ts > CONSENT_MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function saveConsent(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...prefs, ts: Date.now() }))
  } catch {}
}

function loadGA() {
  if (window.__ga_loaded) return
  window.__ga_loaded = true

  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(s)

  window.dataLayer = window.dataLayer || []
  function gtag() { window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', GA_ID)
}

function loadClarity() {
  if (window.__clarity_loaded) return
  window.__clarity_loaded = true

  ;(function(c, l, a, r, i, t, y) {
    c[a] = c[a] || function() { (c[a].q = c[a].q || []).push(arguments) }
    t = l.createElement(r); t.async = 1
    t.src = 'https://www.clarity.ms/tag/' + i
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', CLARITY_ID)
}

function applyConsent(prefs) {
  if (prefs.analytics) loadGA()
  if (prefs.clarity) loadClarity()
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [clarity, setClarity] = useState(true)

  // Sivun latautuessa: jos suostumus on jo annettu, lataa skriptit suoraan
  useEffect(() => {
    const stored = getStored()
    if (stored) {
      applyConsent(stored)
    } else {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  const allDenied = !analytics && !clarity

  function handleAccept() {
    const prefs = { analytics: true, clarity: true }
    saveConsent(prefs)
    applyConsent(prefs)
    setVisible(false)
  }

  function handleSave() {
    const prefs = { analytics, clarity }
    saveConsent(prefs)
    applyConsent(prefs)
    setVisible(false)
  }

  return (
    <div className="cb-backdrop" role="dialog" aria-modal="true" aria-label="Evästeasetukset">
      <div className={`cb-banner ${expanded ? 'cb-banner--expanded' : ''}`}>

        {!expanded ? (
          /* ── BANNERI ── */
          <div className="cb-bar">
            <p className="cb-bar__text">
              Yksityisyytesi on meille tärkeää. Käytämme evästeitä sivuston toiminnan,
              kehittämisen ja analytiikan tueksi.{' '}
              <a href="/tietosuoja" className="cb-bar__link">
                Lisätietoja tietosuojaselosteessa.
              </a>
            </p>
            <div className="cb-bar__actions">
              <button className="cb-btn cb-btn--accept" onClick={handleAccept}>
                Hyväksy
              </button>
              <button
                className="cb-btn cb-btn--settings"
                onClick={() => setExpanded(true)}
              >
                Muuta asetuksia
              </button>
            </div>
          </div>
        ) : (
          /* ── ASETUSPANEELI ── */
          <div className="cb-panel">
            <h2 className="cb-panel__title">Evästeasetukset</h2>
            <p className="cb-panel__desc">
              Voit valita, mitkä analytiikkatyökalut ovat käytössä.
              Välttämättömät toiminnalliset evästeet ovat aina päällä.
            </p>

            <div className="cb-panel__rows">
              <div className="cb-row">
                <div className="cb-row__info">
                  <span className="cb-row__name">Google Analytics</span>
                  <span className="cb-row__desc">Kävijätilastot ja liikenneanalyysi</span>
                </div>
                <button
                  role="switch"
                  aria-checked={analytics}
                  className={`cb-toggle ${analytics ? 'cb-toggle--on' : ''}`}
                  onClick={() => setAnalytics(v => !v)}
                  aria-label="Google Analytics"
                >
                  <span className="cb-toggle__thumb" />
                </button>
              </div>

              <div className="cb-row">
                <div className="cb-row__info">
                  <span className="cb-row__name">Microsoft Clarity</span>
                  <span className="cb-row__desc">Käytettävyys ja heatmap-analyysi</span>
                </div>
                <button
                  role="switch"
                  aria-checked={clarity}
                  className={`cb-toggle ${clarity ? 'cb-toggle--on' : ''}`}
                  onClick={() => setClarity(v => !v)}
                  aria-label="Microsoft Clarity"
                >
                  <span className="cb-toggle__thumb" />
                </button>
              </div>
            </div>

            <div className="cb-panel__footer">
              <button
                className="cb-btn cb-btn--settings"
                onClick={() => setExpanded(false)}
              >
                ← Takaisin
              </button>
              <button
                className={`cb-btn ${allDenied ? 'cb-btn--deny' : 'cb-btn--accept'}`}
                onClick={handleSave}
              >
                {allDenied ? 'Hylkää kaikki' : 'Tallenna'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
