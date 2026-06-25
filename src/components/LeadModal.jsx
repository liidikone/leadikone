// LeadModal.jsx — Yhteydenottolomake, lähettää konfiguraatiotiedot backendiin
// Sijoita: src/components/LeadModal.jsx (tai sama kansio kuin Hinnoittelu.jsx)

import { useState, useEffect } from 'react'
import './LeadModal.css'

const API_URL = import.meta.env.VITE_LEADS_API_URL || '/api/leads'

export default function LeadModal({ isOpen, onClose, type, config, priceSummary }) {
  const [form, setForm] = useState({ nimi: '', yritys: '', email: '', puhelin: '', viesti: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  // Piilota/näytä AI-widget ja chat-label kun modal avataan/suljetaan
  useEffect(() => {
    const widget = document.querySelector('[data-synabs-widget-slug]')
    if (widget) widget.style.display = isOpen ? 'none' : ''
    if (isOpen) {
      document.body.classList.add('lead-modal-open')
    } else {
      document.body.classList.remove('lead-modal-open')
    }
  }, [isOpen])

  if (!isOpen) return null

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          config,
          ...form,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Jokin meni pieleen. Yritä uudelleen.')
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setErrorMsg('Yhteysvirhe. Tarkista nettiyhteys ja yritä uudelleen.')
      setStatus('error')
    }
  }

  return (
    <div className="lm-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="lm-modal" role="dialog" aria-modal="true" aria-label="Pyydä tarjous">
        <button className="lm-close" onClick={onClose} aria-label="Sulje">✕</button>

        {status === 'success' ? (
          <div className="lm-success">
            <div className="lm-success__icon">✓</div>
            <h3 className="lm-success__title">Yhteydenotto lähetetty!</h3>
            <p className="lm-success__text">
              Olemme sinuun yhteydessä pian. Tarkistamme viestisi ja palaamme asiaan mahdollisimman nopeasti.
            </p>
            <button className="lm-cta" onClick={onClose}>Sulje</button>
          </div>
        ) : (
          <>
            <div className="lm-header">
              <span className="lm-eyebrow">
                {type === 'video' ? 'Lyhytvideot' : 'Verkkosivut'}
              </span>
              <h2 className="lm-title">Pyydä tarjous</h2>
              {priceSummary && (
                <div className="lm-price-preview">{priceSummary}</div>
              )}
            </div>

            <form className="lm-form" onSubmit={handleSubmit} noValidate>
              <div className="lm-row">
                <div className="lm-field">
                  <label className="lm-label" htmlFor="lm-nimi">Nimi *</label>
                  <input
                    id="lm-nimi"
                    className="lm-input"
                    type="text"
                    placeholder="Sinun Nimesi"
                    value={form.nimi}
                    onChange={set('nimi')}
                    required
                    autoComplete="name"
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label" htmlFor="lm-yritys">Yritys</label>
                  <input
                    id="lm-yritys"
                    className="lm-input"
                    type="text"
                    placeholder="Yritys Oy"
                    value={form.yritys}
                    onChange={set('yritys')}
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div className="lm-row">
                <div className="lm-field">
                  <label className="lm-label" htmlFor="lm-email">Sähköposti *</label>
                  <input
                    id="lm-email"
                    className="lm-input"
                    type="email"
                    placeholder="sinä@yritys.fi"
                    value={form.email}
                    onChange={set('email')}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="lm-field">
                  <label className="lm-label" htmlFor="lm-puhelin">Puhelin</label>
                  <input
                    id="lm-puhelin"
                    className="lm-input"
                    type="tel"
                    placeholder="+358 40 123 4567"
                    value={form.puhelin}
                    onChange={set('puhelin')}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="lm-field">
                <label className="lm-label" htmlFor="lm-viesti">Viesti</label>
                <textarea
                  id="lm-viesti"
                  className="lm-input lm-textarea"
                  placeholder="Kerro lisää tarpeistasi tai kysy vapaasti..."
                  rows={3}
                  value={form.viesti}
                  onChange={set('viesti')}
                />
              </div>

              {status === 'error' && (
                <div className="lm-error">{errorMsg}</div>
              )}

              <button
                type="submit"
                className="lm-cta"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="lm-spinner" />
                ) : (
                  'Lähetä yhteydenotto'
                )}
              </button>

              <p className="lm-disclaimer">
                Tietosi ovat turvassa. Emme jaa niitä kolmansille osapuolille.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
