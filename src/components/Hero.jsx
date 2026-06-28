"use client"
import { useEffect, useState } from 'react'
import '../styles/Hero.css'

export default function Hero() {
  const [chatOpen, setChatOpen] = useState(false)

  useEffect(() => {
    function loadSynabsWidget() {
      if (document.querySelector('script[src="https://synabs-admin.vercel.app/liidikone-widget.js"]')) return
      const script = document.createElement('script')
      script.src = 'https://synabs-admin.vercel.app/liidikone-widget.js'
      script.setAttribute('data-api-base', 'https://synabs-admin.vercel.app')
      script.setAttribute('data-bot-slug', 'liidikone')
      script.async = true
      document.body.appendChild(script)
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      loadSynabsWidget()
    } else {
      document.addEventListener('DOMContentLoaded', loadSynabsWidget)
      return () => document.removeEventListener('DOMContentLoaded', loadSynabsWidget)
    }
  }, [])

  useEffect(() => {
    let panelObserver = null
    let hostObserver = null
    function watchPanel(winWrap) {
      const update = () => setChatOpen(winWrap.classList.contains('open'))
      update()
      panelObserver = new MutationObserver(update)
      panelObserver.observe(winWrap, { attributes: true, attributeFilter: ['class'] })
    }
    function tryAttach() {
      const host = document.querySelector('[data-synabs-widget-slug]')
      if (host && host.shadowRoot) {
        const winWrap = host.shadowRoot.getElementById('win-wrap')
        if (winWrap) { watchPanel(winWrap); return true }
      }
      return false
    }
    if (!tryAttach()) {
      hostObserver = new MutationObserver(() => {
        if (tryAttach() && hostObserver) { hostObserver.disconnect(); hostObserver = null }
      })
      hostObserver.observe(document.body, { childList: true, subtree: true })
    }
    return () => {
      if (panelObserver) panelObserver.disconnect()
      if (hostObserver) hostObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    function handleDocClick(e) {
      const target = e.target.closest('[id*="synabs" i], [class*="synabs" i]')
      if (target) setChatOpen(true)
    }
    document.addEventListener('click', handleDocClick, true)
    return () => document.removeEventListener('click', handleDocClick, true)
  }, [])

  // Järjestys: autodel, autokeskus, flyers, ilona tampere, renkaatalle,
  // suomen terassilasitus, renkaatalle, gold store, synabs, xpower, synabs, verkkopantteri
  const logos = [
    '/referenssit/gold_store_finland_500px.avif',
    '/referenssit/verkkopantteri_500px.avif',
    '/referenssit/xpower_membership_egym_500px.avif',
    '/referenssit/autodel_500px.avif',
    '/referenssit/autokeskus_haapala_500px.avif',
    '/referenssit/flyers_500px.avif',
    '/referenssit/ilona_tampere_500px.avif',
    '/referenssit/renkaatalle_500px.avif',
    '/referenssit/suomen_terassilasitus_500px.avif',
    '/referenssit/synabs_500px.avif',
  ]

  // 4x toisto saumatonta looppia varten
  const trackLogos = [...logos, ...logos, ...logos, ...logos]

  return (
    <section className="hero" id="hero">
      <div className="hero__bg" aria-hidden="true">
        <img src="/hero-bg.png" alt="" loading="eager" fetchPriority="high" />
        <div className="hero__bg-fade hero__bg-fade--left" />
        <div className="hero__bg-fade hero__bg-fade--right" />
      </div>

      <div className="hero__content">
        <h1 className="hero__title">
          SOMET<span className="hero__title-on">ON</span><br />
          <span className="hero__title-accent">→LIIDIKONE</span>
        </h1>
        <p className="hero__lead hero__lead--pc">Muuta näyttökerrat rahaksi</p>
      </div>

      <div className="hero__red-line" aria-hidden="true" />

      <p className="hero__lead hero__lead--mobile">Muuta näyttökerrat rahaksi</p>

      <div className="hero__ref-wheel" aria-hidden="true">
        <div className="hero__ref-track">
          {trackLogos.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className="hero__ref-logo"
              loading="eager"
              decoding="async"
            />
          ))}
        </div>
      </div>

      <p className={`hero__chat-label${chatOpen ? ' is-hidden' : ''}`}>
        Kysymyksiä?<br />Kysy AI agentilta
      </p>
    </section>
  )
}
