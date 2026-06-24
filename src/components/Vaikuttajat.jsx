import { useRef, useState, useEffect } from 'react'
import '../styles/Vaikuttajat.css'

const CARD_W_DESKTOP = 220
const CARD_W_MOBILE  = 180
const PEEK_DESKTOP   = Math.round(CARD_W_DESKTOP * 0.38)
const PEEK_MOBILE    = Math.round(CARD_W_MOBILE  * 0.38)
const TOTAL_CARDS    = 16
const CARDS_PER_PAGE = 8
const TOTAL_PAGES    = Math.ceil(TOTAL_CARDS / CARDS_PER_PAGE)

// ── Audio ─────────────────────────────────────────────────────────────────────

let _audioCtx   = null
let _audioReady = false

function initAudio() {
  if (_audioReady) return
  try {
    _audioCtx  = new (window.AudioContext || window.webkitAudioContext)()
    _audioReady = true
  } catch (_) {}
}

// Try to init immediately (works in most browsers after any user gesture on the page)
if (typeof window !== 'undefined') {
  const earlyInit = () => {
    initAudio()
    window.removeEventListener('pointerover', earlyInit, true)
    window.removeEventListener('pointerdown', earlyInit, true)
    window.removeEventListener('touchstart', earlyInit, true)
  }
  window.addEventListener('pointerover', earlyInit, { capture: true, once: true })
  window.addEventListener('pointerdown', earlyInit, { capture: true, once: true })
  window.addEventListener('touchstart', earlyInit, { capture: true, once: true })
}

function playCardSound() {
  if (!_audioReady || !_audioCtx) return
  try {
    if (_audioCtx.state === 'suspended') _audioCtx.resume()
    const ctx = _audioCtx
    const now = ctx.currentTime
    const dur = 0.09
    const size = Math.floor(ctx.sampleRate * dur)
    const buf  = ctx.createBuffer(1, size, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < size; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / size)
    const noise = ctx.createBufferSource()
    noise.buffer = buf
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'; bp.Q.value = 0.6
    bp.frequency.setValueAtTime(4200, now)
    bp.frequency.exponentialRampToValueAtTime(1500, now + dur)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur)
    noise.connect(bp); bp.connect(gain); gain.connect(ctx.destination)
    noise.start(now); noise.stop(now + dur)
  } catch (_) {}
}

// ── Data ──────────────────────────────────────────────────────────────────────

const influencers = [
  { id: 1,  label: 'Anniina',  img: '/sisallontuottaja_01.avif' },
  { id: 2,  label: 'Pauliina', img: '/sisallontuottaja_01.avif' },
  { id: 3,  label: 'Santeri',  img: '/sisallontuottaja_01.avif' },
  { id: 4,  label: 'Veera',    img: '/sisallontuottaja_01.avif' },
  ...Array.from({ length: 12 }, (_, i) => ({ id: i + 5, label: null, img: null })),
]

// ── Arrow button ───────────────────────────────────────────────────────────────

function ArrowButton({ dir, onClick, disabled }) {
  const isBack = dir === 'back'
  return (
    <button
      className={'vi-stack-arrow' + (disabled ? ' vi-stack-arrow--disabled' : '')}
      onClick={disabled ? undefined : onClick}
      aria-label={isBack ? 'Edellinen' : 'Seuraava'}
      tabIndex={disabled ? -1 : 0}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {isBack
          ? <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </button>
  )
}

// ── Card renderer ──────────────────────────────────────────────────────────────

function Card({ card, isActive, isDim, style }) {
  const isEmpty = !card.img
  return (
    <div
      className={
        'vi-card' +
        (isActive ? ' vi-card--active' : '') +
        (isDim    ? ' vi-card--dim'    : '') +
        (isEmpty  ? ' vi-card--empty'  : ' vi-card--filled')
      }
      style={style}
    >
      {isEmpty ? (
        <div className="vi-card__inset">
          <span className="vi-card__qmark">?</span>
        </div>
      ) : (
        <>
          <div className="vi-card__clip">
            <div className="vi-card__bg" style={{ backgroundImage: `url('${card.img}')` }} />
            <div className="vi-card__overlay" />
            <div className="vi-card__accent" />
          </div>
          <div className="vi-card__body">
            <span className="vi-card__label">{card.label}</span>
          </div>
        </>
      )}
    </div>
  )
}

// ── Mobile drag stack ──────────────────────────────────────────────────────────

function MobileStack() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const drag = useRef({ active: false, startX: 0, startY: 0, startIdx: 0, lastSnap: 0, moved: false, baseX: 0 })
  const sceneRef = useRef(null)

  const STEP = PEEK_MOBILE

  function getTargetX(idx) { return -idx * PEEK_MOBILE }

  function snapTo(idx) {
    const clamped = Math.max(0, Math.min(TOTAL_CARDS - 1, idx))
    if (clamped !== drag.current.lastSnap) { drag.current.lastSnap = clamped; playCardSound() }
    setActiveIdx(clamped)
    setTranslateX(getTargetX(clamped))
  }

  function onTouchStart(e) {
    const t = e.touches[0]
    drag.current = { active: true, startX: t.clientX, startY: t.clientY, startIdx: activeIdx, lastSnap: activeIdx, moved: false, baseX: getTargetX(activeIdx) }
  }

  function onTouchMove(e) {
    if (!drag.current.active) return
    const t = e.touches[0]
    const dx = t.clientX - drag.current.startX
    const dy = t.clientY - drag.current.startY
    if (!drag.current.moved && Math.abs(dy) > Math.abs(dx)) { drag.current.active = false; return }
    drag.current.moved = true
    e.preventDefault()
    const raw = drag.current.baseX + dx
    const minX = getTargetX(TOTAL_CARDS - 1)
    const maxX = 0
    const clamped = raw < minX ? minX + (raw - minX) * 0.2 : raw > maxX ? maxX + (raw - maxX) * 0.2 : raw
    setTranslateX(clamped)
    const tentative = Math.max(0, Math.min(TOTAL_CARDS - 1, Math.round(-raw / STEP)))
    if (tentative !== drag.current.lastSnap) { drag.current.lastSnap = tentative; playCardSound(); setActiveIdx(tentative) }
  }

  function onTouchEnd(e) {
    if (!drag.current.active) return
    drag.current.active = false
    if (!drag.current.moved) return
    const dx = e.changedTouches[0].clientX - drag.current.startX
    let next = drag.current.startIdx
    if (dx < -40) next = drag.current.startIdx + Math.max(1, Math.round(-dx / STEP))
    else if (dx > 40) next = drag.current.startIdx - Math.max(1, Math.round(dx / STEP))
    snapTo(next)
  }

  const PEEK = PEEK_MOBILE

  return (
    <div className="vi-wrapper">
      <div className="vi-mobile-hint" aria-hidden="true">
        <span className="vi-mobile-hint__text">SELAA</span>
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
          <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="vi-scene-outer">
        <div className="vi-scene-wrap vi-scene-wrap--mobile">
          <div
            ref={sceneRef}
            className="vi-scene"
            style={{
              width:     (CARD_W_MOBILE + (TOTAL_CARDS - 1) * PEEK) + 'px',
              height:    '300px',
              transform: `translateX(${translateX}px)`,
              transition: drag.current.active ? 'none' : 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
              touchAction: 'pan-y',
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {influencers.map((card, i) => (
              <Card
                key={card.id}
                card={card}
                isActive={i === activeIdx}
                isDim={i !== activeIdx}
                style={{
                  left:   i * PEEK + 'px',
                  zIndex: i === activeIdx ? 50 : TOTAL_CARDS - i,
                  width:  CARD_W_MOBILE + 'px',
                  height: '280px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


// ── Desktop hover stack ────────────────────────────────────────────────────────

function DesktopStack() {
  const PEEK = PEEK_DESKTOP
  const [activeCard, setActiveCard] = useState(influencers[0].id)
  const [page, setPage]             = useState(0)

  const pageCards  = influencers.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE)
  const stackWidth = CARD_W_DESKTOP + (pageCards.length - 1) * PEEK

  function handleEnter(id) {
    initAudio()
    playCardSound()
    if (id !== activeCard) { setActiveCard(id) }
  }

  function goTo(dir) {
    const next = page + dir
    if (next < 0 || next >= TOTAL_PAGES) return
    setActiveCard(influencers[next * CARDS_PER_PAGE]?.id ?? null)
    setPage(next)
  }

  return (
    <div className="vi-wrapper" onPointerDown={initAudio}>
      <div className="vi-scene-outer">
        <div
          className="vi-scene-wrap"
          onMouseLeave={() => setActiveCard(pageCards[0]?.id ?? null)}
        >
          <div className="vi-scene" style={{ width: stackWidth + 'px', height: '360px' }}>
            <div className="vi-stack-arrow-wrap vi-stack-arrow-wrap--back">
              <ArrowButton dir="back" onClick={() => goTo(-1)} disabled={page === 0} />
            </div>
            <div className="vi-stack-arrow-wrap vi-stack-arrow-wrap--forward">
              <ArrowButton dir="forward" onClick={() => goTo(1)} disabled={page >= TOTAL_PAGES - 1} />
            </div>
            {pageCards.map((card, i) => (
              <Card
                key={card.id}
                card={card}
                isActive={activeCard === card.id}
                isDim={activeCard !== null && activeCard !== card.id}
                style={{
                  left:   i * PEEK + 'px',
                  zIndex: activeCard === card.id ? 50 : pageCards.length - i,
                  // desktop sizes come from CSS
                }}
                // pass onMouseEnter via wrapper div since Card doesn't take it
              />
            )).map((el, i) => (
              <div key={pageCards[i].id} onMouseEnter={() => handleEnter(pageCards[i].id)} style={{ position: 'absolute', left: i * PEEK + 'px', zIndex: activeCard === pageCards[i].id ? 50 : pageCards.length - i }}>
                <Card
                  card={pageCards[i]}
                  isActive={activeCard === pageCards[i].id}
                  isDim={activeCard !== null && activeCard !== pageCards[i].id}
                  style={{ position: 'static' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Root ───────────────────────────────────────────────────────────────────────

export default function Vaikuttajat() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <section className="vaikuttajat" id="vaikuttajat">
      <div className="vaikuttajat__inner">
        <div className="vaikuttajat__header">
          <h2 className="vaikuttajat__title">
            SOMET<span className="vaikuttajat__title-on">ON</span>
            <span className="vaikuttajat__title-accent">vaikuttajilla</span>
          </h2>
          <p className="vaikuttajat__lead">
            Vaikuttajaverkostomme koostuu valituista ammattilaisista, jotka ymmärtävät digitaalisen
            sisällön tekemisen, yleisöjen käyttäytymisen ja toimivien lyhytvideoiden rakentamisen.
            He luovat yrityksesi näköistä, koukuttavaa sisältöä, joka herättää kiinnostusta ja
            kasvattaa näkyvyyttä.
          </p>
        </div>
        {isMobile ? <MobileStack /> : <DesktopStack />}
      </div>
    </section>
  )
}
