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
// AudioContext must be created/resumed directly inside a user-gesture handler.
// We create it lazily on first hover/touch so it's always inside a gesture.

let _audioCtx = null

function getAudioCtx() {
  if (!_audioCtx) {
    try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)() } catch (_) {}
  }
  return _audioCtx
}

function playCardSound() {
  const ctx = getAudioCtx()
  if (!ctx) return
  try {
    // Resume must happen in the same gesture tick
    const play = () => {
      const now  = ctx.currentTime
      const dur  = 0.09
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
    }
    if (ctx.state === 'suspended') {
      ctx.resume().then(play)
    } else {
      play()
    }
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
// Uses touch-action: pan-x (set in CSS on .vi-scene-wrap--mobile) so the
// browser handles vertical page scroll while we handle horizontal swipe.
// No e.preventDefault() — that would block the vertical scroll on mobile.

function MobileStack() {
  const PEEK = PEEK_MOBILE
  const [activeIdx, setActiveIdx] = useState(0)
  const [dragging, setDragging]   = useState(false)
  const [offsetX, setOffsetX]     = useState(0)
  const drag = useRef({ startX: 0, startIdx: 0, lastSnap: 0 })

  function onPointerDown(e) {
    // Only handle horizontal primary-button / single-touch
    if (e.pointerType === 'mouse' && e.button !== 0) return
    drag.current = { startX: e.clientX, startIdx: activeIdx, lastSnap: activeIdx }
    setDragging(true)
    setOffsetX(0)
    // Capture so we get move/up even if pointer leaves element
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function onPointerMove(e) {
    if (!dragging) return
    const dx       = e.clientX - drag.current.startX
    const delta    = -Math.round(dx / PEEK)
    const tentative = Math.max(0, Math.min(TOTAL_CARDS - 1, drag.current.startIdx + delta))
    setOffsetX(dx)
    if (tentative !== drag.current.lastSnap) {
      drag.current.lastSnap = tentative
      setActiveIdx(tentative)
      playCardSound()
    }
  }

  function onPointerUp(e) {
    if (!dragging) return
    const dx    = e.clientX - drag.current.startX
    const delta = -Math.round(dx / PEEK)
    const final = Math.max(0, Math.min(TOTAL_CARDS - 1, drag.current.startIdx + delta))
    setActiveIdx(final)
    setOffsetX(0)
    setDragging(false)
  }

  // translateX: during drag = raw offset; on release = snap offset so cards
  // shift back to show the active card at position 0 with a smooth transition.
  const snapOffset = -activeIdx * PEEK
  const translateX = dragging ? offsetX - activeIdx * PEEK + drag.current.startIdx * PEEK : snapOffset

  return (
    <div className="vi-wrapper">
      <div className="vi-mobile-hint" aria-hidden="true">
        <span className="vi-mobile-hint__text">SELAA</span>
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
          <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <div className="vi-scene-outer">
        <div
          className={'vi-scene-wrap vi-scene-wrap--mobile' + (dragging ? ' vi-scene-wrap--draggable' : '')}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div
            className="vi-scene"
            style={{
              width:      (CARD_W_MOBILE + (TOTAL_CARDS - 1) * PEEK) + 'px',
              height:     '300px',
              transform:  `translateX(${translateX}px)`,
              transition: dragging ? 'none' : 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
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

  // Called directly from onMouseEnter — this IS a user gesture so AudioContext
  // can be created and resumed here without needing a prior click.
  function handleEnter(id) {
    playCardSound()
    if (id !== activeCard) setActiveCard(id)
  }

  function goTo(dir) {
    const next = page + dir
    if (next < 0 || next >= TOTAL_PAGES) return
    setActiveCard(influencers[next * CARDS_PER_PAGE]?.id ?? null)
    setPage(next)
  }

  return (
    <div className="vi-wrapper">
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
              <div
                key={card.id}
                onMouseEnter={() => handleEnter(card.id)}
                style={{
                  position: 'absolute',
                  left:     i * PEEK + 'px',
                  zIndex:   activeCard === card.id ? 50 : pageCards.length - i,
                }}
              >
                <Card
                  card={card}
                  isActive={activeCard === card.id}
                  isDim={activeCard !== null && activeCard !== card.id}
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
