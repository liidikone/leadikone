import { useState, useEffect } from 'react'
import '../styles/Hinnoittelu.css'
import LeadModal from './LeadModal'

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
  // monthly prices (per month, after discount)
  const videoMonthly = base * (1 - discountRate)
  const platformOneTime = platforms.length * 50
  const platformMonthly = platforms.length * 50
  const influencerMonthly = wantInfluencer ? 200 : 0
  const managementMonthly = wantManagement ? 100 : 0

  // total per month (discounted)
  const totalPerMonth = videoMonthly + managementMonthly + influencerMonthly + platformMonthly
  // total per month WITHOUT discount (for discount calculation)
  const totalPerMonthBase = base + managementMonthly + influencerMonthly + platformMonthly
  const discountPerMonth = totalPerMonthBase - totalPerMonth

  const hasDiscount = discountRate > 0

  const [modalOpen, setModalOpen] = useState(false)

  const videoConfig = {
    videos,
    months,
    platforms,
    wantInfluencer,
    wantManagement,
    totalPerMonth,
    totalPerMonthBase,
    discountRate,
    platformOneTime,
  }

  const priceSummary =
    hasDiscount
      ? `${videos} videota/kk • ${months} kk sopimus • ${totalPerMonth.toFixed(0)}€/kk (ale ${Math.round(discountRate * 100)}%)`
      : `${videos} videota/kk • ${months} kk sopimus • ${totalPerMonth.toFixed(0)}€/kk`

  return (
    <>
    <LeadModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      type="video"
      config={videoConfig}
      priceSummary={priceSummary}
    />
    <div className="hp-package">
      <div className="hp-package__desc" style={{ padding: '1.2rem 1.5rem 0', color: '#333', fontSize: '0.78rem', lineHeight: 1.5 }}>
        Lyhytvideot lisäävät tunnettuutta, sitouttavat yleisöä ja ohjaavat potentiaalisia asiakkaita palveluidesi pariin.
      </div>
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
                <span className="hp-pill__price">{basePrices[v]}€/kk</span>
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
                {badge && (
                  <span className="hp-pill__badge hp-pill__badge--green">{badge}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="hp-config-group">
          <label className="hp-label">Valitse alustasi</label>
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
              <span className="hp-toggle__check" style={wantInfluencer ? { background: '#00ff88', borderColor: '#00ff88', color: '#000000' } : {}}>{wantInfluencer ? '✓' : '+'}</span>
              <span className="hp-toggle__text">
                Haluan SOMET<span style={{ color: '#00ff88', fontWeight: 700 }}>ON</span> vaikuttajan videoille
              </span>
              <span className="hp-toggle__price">200€/kk</span>
            </button>
            <button
              className={`hp-toggle${wantManagement ? ' hp-toggle--active' : ''}`}
              onClick={() => setWantManagement(v => !v)}
            >
              <span className="hp-toggle__check" style={wantManagement ? { background: '#00ff88', borderColor: '#00ff88', color: '#000000' } : {}}>{wantManagement ? '✓' : '+'}</span>
              <span className="hp-toggle__text">
                Haluan että SOMET<span style={{ color: '#00ff88', fontWeight: 700 }}>ON</span> huolehtii videoiden julkaisemisesta
              </span>
              <span className="hp-toggle__price">100€/kk</span>
            </button>
          </div>
        </div>
      </div>

      <div className="hp-summary">
        <div className="hp-summary__rows">
          {/* Video row — always shows /kk price */}
          <div className="hp-summary__row">
            <span>{videos} videota/kk</span>
            <span className="hp-summary__row-price">
              {hasDiscount && (
                <span className="hp-summary__strikethrough">{base}€</span>
              )}
              {videoMonthly.toFixed(0)}€/kk
            </span>
          </div>

          {/* Platform one-time setup */}
          {platforms.length > 0 && (
            <div className="hp-summary__row">
              <span>Alustat avaus ({platforms.length} kpl)</span>
              <span className="hp-summary__row-price">{platformOneTime}€</span>
            </div>
          )}

          {/* Platform monthly */}
          {platforms.length > 0 && (
            <div className="hp-summary__row">
              <span>Alustat/kk</span>
              <span className="hp-summary__row-price">
                {platformMonthly}€/kk
              </span>
            </div>
          )}

          {/* Influencer monthly */}
          {wantInfluencer && (
            <div className="hp-summary__row">
              <span>Vaikuttaja</span>
              <span className="hp-summary__row-price">
                {influencerMonthly}€/kk
              </span>
            </div>
          )}

          {/* Management monthly */}
          {wantManagement && (
            <div className="hp-summary__row">
              <span>Tilien ylläpito</span>
              <span className="hp-summary__row-price">
                {managementMonthly}€/kk
              </span>
            </div>
          )}

          {/* Discount row */}
          {hasDiscount && (
            <div className="hp-summary__row hp-summary__row--discount">
              <span style={{ color: '#00ff88', fontWeight: 600 }}>
                Sopimusalennus ({Math.round(discountRate * 100)}%)
              </span>
              <span className="hp-summary__row-price" style={{ color: '#00ff88', fontWeight: 600 }}>
                −{discountPerMonth.toFixed(0)}€/kk
              </span>
            </div>
          )}
        </div>

        {/* Total — always /kk, always black */}
        <div className="hp-summary__total">
          <span>Yhteensä</span>
          <div className="hp-summary__price-wrap">
            {hasDiscount && (
              <span className="hp-summary__price-original">{totalPerMonthBase.toFixed(0)}€</span>
            )}
            <span className="hp-summary__price hp-summary__price--plain" style={hasDiscount ? { color: '#00ff88' } : {}}>
              {totalPerMonth.toFixed(0)}€<span style={{ fontSize: '0.55em', fontStyle: 'normal', fontWeight: 400, marginLeft: '0.2em', opacity: 0.7 }}>/kk</span>
            </span>
          </div>
        </div>
        <button className="hp-cta" onClick={() => setModalOpen(true)}>
          Pyydä tarjous
        </button>
      </div>
    </div>
    </>
  )
}

/* ── VERKKOSIVUT ─────────────────────────────────────────── */
const websiteDetails = [
  {
    heading: 'Suunnittelu',
    items: [
      'Tavoitteiden ja kohderyhmän määrittely',
      'Verkkosivuston rakenteen ja layoutin suunnittelu',
      'Visuaalisen ilmeen suunnittelu: värit, fontit ja tyyli',
    ],
  },
  {
    heading: 'Tekninen toteutus',
    items: [
      'Responsiivinen verkkosivu (toimii mobiilissa, tabletilla ja tietokoneella)',
      'Yhteydenottolomake ja tarvittavat toiminnallisuudet',
      'Sivuston tekninen optimointi',
    ],
  },
  {
    heading: 'Sisältö ja hakukonenäkyvyys',
    items: [
      'Tekstien ja kuvien lisääminen sivuille',
      'SEO-optimointi hakukonenäkyvyyden parantamiseksi',
      'Metatietojen optimointi (otsikot ja meta-kuvaukset) hakutuloksia varten',
    ],
  },
  {
    heading: 'Julkaisu',
    items: [
      'Verkkotunnuksen ja hostingin käyttöönotto',
      'Testaus eri selaimilla ja laitteilla',
      'Verkkosivuston julkaisu ja käyttöönotto',
    ],
  },
]

function WebsitePackage() {
  const [open, setOpen] = useState(false)
  const [pages, setPages] = useState('1-5')
  const [maintenance, setMaintenance] = useState('vakio')
  const [wantBrand, setWantBrand] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const pagePrices = { '1-5': 1000, '6-10': 2000, '10+': 4000 }
  const maintenancePrices = { vakio: 100, tasma: 249 }

  const pagePrice = pagePrices[pages]
  const maintenancePrice = maintenancePrices[maintenance]
  const totalOneTime = pagePrice + (wantBrand ? 499 : 0)

  const websiteConfig = {
    pages,
    maintenance,
    wantBrand,
    pagePrice,
    maintenancePrice,
    totalOneTime,
  }

  const priceSummary = `${pages} sivua • ${maintenance === 'vakio' ? 'VAKIO' : 'TÄSMÄ'}-ylläpito • ${wantBrand ? 'alk. ' : ''}${totalOneTime}€ + ${maintenancePrice}€/kk`

  return (
    <>
    <LeadModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      type="website"
      config={websiteConfig}
      priceSummary={priceSummary}
    />
    <div className="hp-package">
      <div className="hp-package__desc" style={{ padding: '1.2rem 1.5rem 0', color: '#333', fontSize: '0.78rem', lineHeight: 1.5 }}>
        Modernit verkkosivut parantavat kävijöiden konversioastetta ja luovat vahvan ensivaikutelman brändistä.
      </div>
      <div className="hp-configurator">

        <div className="hp-config-group">
          <label className="hp-label">Sivujen määrä</label>
          <div className="hp-pills">
            {[
              { k: '1-5', label: '1–5 sivua', price: 1000 },
              { k: '6-10', label: '6–10 sivua', price: 2000 },
              { k: '10+', label: '+10 sivua', price: 4000, prefix: 'alk. ' },
            ].map(({ k, label, price, prefix }) => (
              <button
                key={k}
                className={`hp-pill${pages === k ? ' hp-pill--active' : ''}`}
                onClick={() => setPages(k)}
              >
                <span className="hp-pill__count">{label}</span>
                <span className="hp-pill__price">{prefix || ''}{price}€</span>
              </button>
            ))}
          </div>
        </div>

        <div className="hp-config-group">
          <button className="hp-expand-btn" onClick={() => setOpen(v => !v)}>
            <span>Avaa lisätiedot tästä</span>
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
          <label className="hp-label">Ylläpito</label>
          <div className="hp-toggles">
            {/* VAKIO */}
            <button
              className={`hp-toggle${maintenance === 'vakio' ? ' hp-toggle--active' : ''}`}
              onClick={() => setMaintenance('vakio')}
            >
              <span className="hp-toggle__check" style={maintenance === 'vakio' ? { background: '#00ff88', borderColor: '#00ff88', color: '#000000' } : {}}>
                {maintenance === 'vakio' ? '✓' : ''}
              </span>
              <span className="hp-toggle__text">
                <strong style={{ fontWeight: 700, display: 'block', fontSize: '0.85rem' }}>VAKIO (aina ajan tasalla 12 kuukautta)</strong>
                <span style={{ fontWeight: 300, fontSize: '0.78rem', opacity: 0.75 }}>SOMET<span style={{ color: '#00ff88', fontWeight: 700 }}>ON</span> pitää verkkosivusi ajan tasalla ja toimintavarmana. Paketti sisältää hostingin, teknisen tuen, päivitykset ja jatkuvan ylläpidon.</span>
              </span>
              <span className="hp-toggle__price">100€/kk</span>
            </button>
            {/* TÄSMÄ */}
            <button
              className={`hp-toggle${maintenance === 'tasma' ? ' hp-toggle--active' : ''}`}
              onClick={() => setMaintenance('tasma')}
            >
              <span className="hp-toggle__check" style={maintenance === 'tasma' ? { background: '#00ff88', borderColor: '#00ff88', color: '#000000' } : {}}>
                {maintenance === 'tasma' ? '✓' : ''}
              </span>
              <span className="hp-toggle__text">
                <strong style={{ fontWeight: 700, display: 'block', fontSize: '0.85rem' }}>TÄSMÄ (analyyttinen kasvu 12 kuukautta)</strong>
                <span style={{ fontWeight: 300, fontSize: '0.78rem', opacity: 0.75 }}>sis. VAKIO ominaisuudet + SOMET<span style={{ color: '#00ff88', fontWeight: 700 }}>ON</span> auttaa kasvattamaan verkkosivustosi tuloksia datan avulla. Seuranta, analyysi ja kuukausittaiset optimoinnit perustuvat todelliseen kävijäkäyttäytymiseen.</span>
              </span>
              <span className="hp-toggle__price">249€/kk</span>
            </button>
          </div>
        </div>

        <div className="hp-config-group">
          <label className="hp-label">Brändi</label>
          <div className="hp-toggles">
            <button
              className={`hp-toggle${wantBrand ? ' hp-toggle--active' : ''}`}
              onClick={() => setWantBrand(v => !v)}
            >
              <span className="hp-toggle__check" style={wantBrand ? { background: '#00ff88', borderColor: '#00ff88', color: '#000000' } : {}}>{wantBrand ? '✓' : '+'}</span>
              <span className="hp-toggle__text">
                <strong style={{ fontWeight: 700, display: 'block', fontSize: '0.85rem' }}>BRÄNDIUUDISTUS</strong>
                <span style={{ fontWeight: 300, fontSize: '0.78rem', opacity: 0.75 }}>sis. logon, värimaailman, typografian, visuaalisen tyylin, graafiset materiaalit sekä brändiä tukevat tekoälyllä tuotetut kuvat ja videot.</span>
              </span>
              <span className="hp-toggle__price">alk. 499€</span>
            </button>
          </div>
        </div>

      </div>

      <div className="hp-summary">
        <div className="hp-summary__rows">
          <div className="hp-summary__row hp-summary__row--section-label">
            <span>Kertamaksu</span>
          </div>
          <div className="hp-summary__row">
            <span>Verkkosivut ({pages} sivua)</span>
            <span className="hp-summary__row-price">{pages === '10+' ? 'alk. ' : ''}{pagePrices[pages]}€</span>
          </div>
          {wantBrand && (
            <div className="hp-summary__row">
              <span>Brändiuudistus</span>
              <span className="hp-summary__row-price">alk. 499€</span>
            </div>
          )}
          <div className="hp-summary__row hp-summary__row--section-label" style={{marginTop:'0.5rem'}}>
            <span>Kuukausimaksu</span>
          </div>
          <div className="hp-summary__row">
            <span>Ylläpito ({maintenance === 'vakio' ? 'VAKIO' : 'TÄSMÄ'})</span>
            <span className="hp-summary__row-price">{maintenancePrices[maintenance]}€/kk</span>
          </div>
        </div>
        <div className="hp-summary__total">
          <span>Yhteensä</span>
          <div className="hp-summary__price-wrap">
            <span className="hp-summary__price hp-summary__price--plain">
              {(pages === '10+' || wantBrand) ? 'alk. ' : ''}{pagePrices[pages] + (wantBrand ? 499 : 0)}€
              <span style={{ fontSize: '0.55em', fontStyle: 'normal', fontWeight: 400, marginLeft: '0.2em', opacity: 0.7 }}>+ {maintenancePrices[maintenance]}€/kk</span>
            </span>
          </div>
        </div>
        <button className="hp-cta" onClick={() => setModalOpen(true)}>
          Pyydä tarjous →
        </button>
      </div>
    </div>
    </>
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
  const [flashTab, setFlashTab]   = useState(null)

  useEffect(() => {
    function onSelectTab(e) {
      const { tab } = e.detail
      if (tab === 'ai') {
        setActiveTab('video')
        setFlashTab('ai')
        setTimeout(() => setFlashTab(null), 1600)
      } else {
        setActiveTab(tab)
      }
    }
    window.addEventListener('someton:selectTab', onSelectTab)
    return () => window.removeEventListener('someton:selectTab', onSelectTab)
  }, [])

  const ActiveComponent = TABS.find(t => t.id === activeTab)?.component

  return (
    <section className="hinnoittelu" id="hinnoittelu">
      <div className="hinnoittelu__inner">

        <div className="hinnoittelu__header">
          <h2 className="hinnoittelu__title">
            LIIDIK<span className="hinnoittelu__title-on">ON</span>E
          </h2>
        </div>

        <div>
          <div className="hp-tabs">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={
                  `hp-tab` +
                  (activeTab === tab.id ? ' hp-tab--active' : '') +
                  (tab.coming ? ' hp-tab--coming' : '') +
                  (flashTab === tab.id ? ' hp-tab--flash' : '')
                }
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
