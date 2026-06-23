import { useState } from 'react'
import '../styles/Hinnoittelu.css'

/* ── PLATFORM ICONS ──────────────────────────────────────── */
const PlatformIcons = {
  TikTok: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
}

/* ── LYHYTVIDEOT ─────────────────────────────────────────── */
function VideoPackage() {
  const [videos, setVideos] = useState(4)
  const [months, setMonths] = useState(1)
  const [platforms, setPlatforms] = useState([])
  const [wantInfluencer, setWantInfluencer] = useState(false)
  const [wantManagement, setWantManagement] = useState(false)

  const basePrices = { 4: 800, 6: 1100, 8: 1400 }
  const discounts = { 1: 0, 3: 0.05, 6: 0.10 }
  const platformList = ['TikTok', 'Instagram', 'Facebook', 'LinkedIn', 'YouTube']

  const togglePlatform = (p) =>
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])

  const base = basePrices[videos]
  const discountRate = discounts[months]
  const monthly = base * (1 - discountRate)
  // platforms: 50€ kertamaksu + 50€/kk per alusta
  const platformOneTime = platforms.length * 50
  const platformMonthly = platforms.length * 50
  const influencerMonthly = wantInfluencer ? 200 : 0
  const managementMonthly = wantManagement ? 100 : 0

  const totalPerMonth = monthly + managementMonthly + influencerMonthly + platformMonthly
  const grandTotal = totalPerMonth * months + platformOneTime

  // For discount display
  const baseTotal = (base + managementMonthly + influencerMonthly + platformMonthly) * months + platformOneTime
  const hasDiscount = discountRate > 0

  return (
    <div className="hp-package">
      <div className="hp-configurator">

        <div className="hp-config-group">
          <label className="hp-label">Videoiden määrä / kk</label>
          <div className="hp-pills">
            {[4, 6, 8].map(v => (
              <button
                key={v}
                className={`hp-pill${videos === v ? ' hp-pill--active' : ''}`}
                onClick={() => setVideos(v)}
              >
                <span className="hp-pill__count">{v} kpl</span>
                <span className="hp-pill__price">{basePrices[v]}€</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hp-config-group">
          <label className="hp-label">Sopimuksen kesto</label>
          <div className="hp-pills">
            {[
              { m: 1, label: '1 kk' },
              { m: 3, label: '3 kk', badge: '-5%' },
              { m: 6, label: '6 kk', badge: '-10%' },
            ].map(({ m, label, badge }) => (
              <button
                key={m}
                className={`hp-pill${months === m ? ' hp-pill--active' : ''}`}
                onClick={() => setMonths(m)}
              >
                <span className="hp-pill__count">{label}</span>
                {badge && <span className="hp-pill__badge">{badge}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="hp-config-group">
          <label className="hp-label">
            Alustat
            <span className="hp-label-note"> 50€ avaus + 50€/kk per alusta</span>
          </label>
          <div className="hp-some-icons">
            {platformList.map(p => (
              <button
                key={p}
                className={`hp-some-icon${platforms.includes(p) ? ' hp-some-icon--active' : ''}`}
                onClick={() => togglePlatform(p)}
                title={p}
              >
                {PlatformIcons[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="hp-config-group">
          <label className="hp-label">Lisäpalvelut</label>
          <div className="hp-toggles">
            <button
              className={`hp-toggle${wantInfluencer ? ' hp-toggle--active' : ''}`}
              onClick={() => setWantInfluencer(v => !v)}
            >
              <span className="hp-toggle__check">{wantInfluencer ? '✓' : '+'}</span>
              <span className="hp-toggle__text">
                Haluan teiltä vaikuttajan videoille
              </span>
              <span className="hp-toggle__price">200€/kk</span>
            </button>
            <button
              className={`hp-toggle${wantManagement ? ' hp-toggle--active' : ''}`}
              onClick={() => setWantManagement(v => !v)}
            >
              <span className="hp-toggle__check">{wantManagement ? '✓' : '+'}</span>
              <span className="hp-toggle__text">
                SOMETON ylläpitää tiliäni ja postaa videot
              </span>
              <span className="hp-toggle__price">100€/kk</span>
            </button>
          </div>
        </div>
      </div>

      <div className="hp-summary">
        <div className="hp-summary__rows">
          <div className="hp-summary__row">
            <span>{videos} videota/kk x {months} kk</span>
            <span>{(monthly * months).toFixed(0)}€</span>
          </div>
          {platforms.length > 0 && (
            <>
              <div className="hp-summary__row">
                <span>Alustat avaus ({platforms.length} kpl)</span>
                <span>{platformOneTime}€</span>
              </div>
              <div className="hp-summary__row">
                <span>Alustat/kk x {months} kk</span>
                <span>{platformMonthly * months}€</span>
              </div>
            </>
          )}
          {wantInfluencer && (
            <div className="hp-summary__row">
              <span>Vaikuttaja x {months} kk</span>
              <span>{influencerMonthly * months}€</span>
            </div>
          )}
          {wantManagement && (
            <div className="hp-summary__row">
              <span>Tilien ylläpito x {months} kk</span>
              <span>{managementMonthly * months}€</span>
            </div>
          )}
          {hasDiscount && (
            <div className="hp-summary__row hp-summary__row--discount">
              <span>Sopimusalennus ({Math.round(discountRate * 100)}%)</span>
              <span>-{(baseTotal - grandTotal).toFixed(0)}€</span>
            </div>
          )}
        </div>
        <div className="hp-summary__total">
          <span>Yhteensä</span>
          <div className="hp-summary__price-wrap">
            {hasDiscount && (
              <span className="hp-summary__price-original">{baseTotal.toFixed(0)}€</span>
            )}
            <span className="hp-summary__price">{grandTotal.toFixed(0)}€</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── VERKKOSIVUT ─────────────────────────────────────────── */
const websiteDetails = [
  {
    heading: 'Suunnittelu',
    items: [
      'Tavoitteiden ja kohderyhmän määrittely',
      'Sivuston rakenteen suunnittelu (wireframe)',
      'Visuaalinen ilme: värit, fontit, tyyli',
    ],
  },
  {
    heading: 'Tekninen toteutus',
    items: [
      'Responsiivinen koodi (toimii mobiilissa ja tietokoneella)',
      'Yhteydenottolomake ja muut toiminnallisuudet',
    ],
  },
  {
    heading: 'Sisältö',
    items: [
      'Tekstien ja kuvien lisääminen sivuille',
      'SEO-optimointi hakukonenäkyvyyttä varten',
    ],
  },
  {
    heading: 'Julkaisu',
    items: [
      'Verkkotunnus ja hosting kuntoon',
      'Testaus eri selaimilla ja laitteilla',
      'Julkaisu ja käyttöönotto',
    ],
  },
]

function WebsitePackage() {
  const [open, setOpen] = useState(false)
  const [pages, setPages] = useState('1-5')
  const [analytics, setAnalytics] = useState([])

  const pagePrices = { '1-5': 800, '6-10': 1500, '10+': 2500 }
  const analyticsList = ['Google Analytics + opetus', 'Microsoft Clarity + opetus']

  const toggleAnalytics = (a) =>
    setAnalytics(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  const total = pagePrices[pages] + analytics.length * 100 + 49

  return (
    <div className="hp-package">
      <div className="hp-configurator">

        <div className="hp-config-group">
          <label className="hp-label">Sivujen määrä</label>
          <div className="hp-pills">
            {[
              { k: '1-5', label: '1–5 sivua', price: 800 },
              { k: '6-10', label: '6–10 sivua', price: 1500 },
              { k: '10+', label: '+10 sivua', price: 2500 },
            ].map(({ k, label, price }) => (
              <button
                key={k}
                className={`hp-pill${pages === k ? ' hp-pill--active' : ''}`}
                onClick={() => setPages(k)}
              >
                <span className="hp-pill__count">{label}</span>
                <span className="hp-pill__price">{price}€</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hp-config-group">
          <button className="hp-expand-btn" onClick={() => setOpen(v => !v)}>
            <span>Mitä sisältyy pakettiin?</span>
            <span className={`hp-expand-btn__arrow${open ? ' hp-expand-btn__arrow--open' : ''}`}>↓</span>
          </button>
          {open && (
            <div className="hp-details">
              {websiteDetails.map(({ heading, items }) => (
                <div key={heading} className="hp-details__group">
                  <h4 className="hp-details__heading">{heading.toUpperCase()}</h4>
                  <ul className="hp-details__list">
                    {items.map(item => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="hp-config-group">
          <label className="hp-label">
            Ylläpito <span className="hp-label-note">49€/kk</span>
          </label>
          <div className="hp-included-tag">
            ✓ Sisältyy — tekninen tuki, päivitykset ja ylläpito
          </div>
        </div>

        <div className="hp-config-group">
          <label className="hp-label">Analytiikka <span className="hp-label-note">100€/kpl</span></label>
          <div className="hp-pills hp-pills--wrap">
            {analyticsList.map(a => (
              <button
                key={a}
                className={`hp-pill hp-pill--sm${analytics.includes(a) ? ' hp-pill--active' : ''}`}
                onClick={() => toggleAnalytics(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

      </div>

      <div className="hp-summary">
        <div className="hp-summary__rows">
          <div className="hp-summary__row">
            <span>Verkkosivut ({pages} sivua)</span>
            <span>{pagePrices[pages]}€</span>
          </div>
          <div className="hp-summary__row">
            <span>Ylläpito</span>
            <span>49€/kk</span>
          </div>
          {analytics.map(a => (
            <div className="hp-summary__row" key={a}>
              <span>{a}</span>
              <span>100€</span>
            </div>
          ))}
        </div>
        <div className="hp-summary__total">
          <span>Aloitushinta sis. ylläpito</span>
          <div className="hp-summary__price-wrap">
            <span className="hp-summary__price">{total}€</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── AI AGENTTI ──────────────────────────────────────────── */
function AIPackage() {
  return (
    <div className="hp-package hp-package--coming">
      <div className="hp-coming-body">
        <p className="hp-coming-text">
          AI agentti integroituna verkkosivuille — tulossa pian.
        </p>
      </div>
    </div>
  )
}

/* ── TABS CONFIG ─────────────────────────────────────────── */
const TABS = [
  { id: 'video', label: 'Lyhytvideot', component: VideoPackage },
  { id: 'web', label: 'Verkkosivut', component: WebsitePackage },
  { id: 'ai', label: 'AI agentti', component: AIPackage, coming: true },
]

/* ── MAIN EXPORT ─────────────────────────────────────────── */
export default function Hinnoittelu() {
  const [activeTab, setActiveTab] = useState('video')

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component

  return (
    <section className="hinnoittelu" id="hinnoittelu">
      <div className="hinnoittelu__inner">

        <div className="hinnoittelu__header">
          <span className="hinnoittelu__eyebrow">Palvelupaketit</span>
          <h2 className="hinnoittelu__title">
            Rakenna{' '}
            <span className="hinnoittelu__title-accent">liidikoneesi</span>
          </h2>
          <p className="hinnoittelu__lead">
            Selkeät kokonaisuudet ilman piilokuluja asiakaskunnan kasvattamiseen.
          </p>
        </div>

        <div>
          <div className="hp-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`hp-tab${activeTab === tab.id ? ' hp-tab--active' : ''}${tab.coming ? ' hp-tab--coming' : ''}`}
                onClick={() => !tab.coming && setActiveTab(tab.id)}
              >
                {tab.label}
                {tab.coming && <span className="hp-tab__soon">pian</span>}
              </button>
            ))}
          </div>

          {ActiveComponent && <ActiveComponent />}
        </div>

      </div>
    </section>
  )
}
