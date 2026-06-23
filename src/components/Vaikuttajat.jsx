import { useRef, useState, useEffect, useCallback } from 'react'
import '../styles/Vaikuttajat.css'

const CARD_W = 220
const PEEK   = Math.round(CARD_W * 0.38)
const CARDS_PER_PAGE = 8
const TOTAL_CARDS = 16
const TOTAL_PAGES = Math.ceil(TOTAL_CARDS / CARDS_PER_PAGE)

/* AudioContext singleton at module level — created once on first interaction,
   never inside a React render cycle, so it's always ready when sound fires. */
let _audioCtx = null
function getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (_audioCtx.state === 'suspended') _audioCtx.resume()
  return _audioCtx
}

function playCardSound() {
  try {
    const ctx = getAudioCtx()
    const now = ctx.currentTime
    const dur = 0.09
    const bufferSize = Math.floor(ctx.sampleRate * dur)
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buffer
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 0.6
    bp.frequency.setValueAtTime(4200, now)
    bp.frequency.exponentialRampToValueAtTime(1500, now + dur)
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur)
    noise.connect(bp)
    bp.connect(gain)
    gain.connect(ctx.destination)
    noise.start(now)
    noise.stop(now + dur)
  } catch (_) {}
}

const influencers = [
  { id: 1,  label: 'Anniina',  img: '/sisallontuottaja_01.avif' },
  { id: 2,  label: 'Pauliina', img: '/sisallontuottaja_01.avif' },
  { id: 3,  label: 'Santeri',  img: '/sisallontuottaja_01.avif' },
  { id: 4,  label: 'Veera',    img: '/sisallontuottaja_01.avif' },
  { id: 5,  label: null, img: null },
  { id: 6,  label: null, img: null },
  { id: 7,  label: null, img: null },
  { id: 8,  label: null, img: null },
  { id: 9,  label: null, img: null },
  { id: 10, label: null, img: null },
  { id: 11, label: null, img: null },
  { id: 12, label: null, img: null },
  { id: 13, label: null, img: null },
  { id: 14, label: null, img: null },
  { id: 15, label: null, img: null },
  { id: 16, label: null, img: null },
]

function ArrowButton({ dir, onClick }) {
  const isBack = dir === 'back'
  return (
    <button className="vi-stack-arrow" onClick={onClick} aria-label={isBack ? 'Edellinen' : 'Seuraava'}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        {isBack
          ? <path d="M11 4L6 9L11 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          : <path d="M7 4L12 9L7 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        }
      </svg>
    </button>
  )
}

function StackedCards() {
  const [activeCard, setActiveCard] = useState(null)
  const [page, setPage] = useState(0)

  const pageCards  = influencers.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE)
  const stackWidth = CARD_W + (pageCards.length - 1) * PEEK

  function handleEnter(id) {
    if (id !== activeCard) {
      setActiveCard(id)
      playCardSound()
    }
  }

  function goTo(dir) {
    const next = page + dir
    if (next < 0 || next >= TOTAL_PAGES) return
    setActiveCard(null)
    setPage(next)
  }

  const onFirstInteraction = useCallback(() => {
    getAudioCtx()
  }, [])

  return (
    <div className="vi-wrapper" onPointerDown={onFirstInteraction}>
      <div className="vi-scene-outer">
        <div
          className="vi-scene-wrap"
          onMouseLeave={() => setActiveCard(null)}
        >
          <div
            className="vi-scene"
            style={{ width: stackWidth + 'px', height: '360px' }}
          >
            <div className="vi-stack-arrow-wrap">
            <ArrowButton
              dir={page < TOTAL_PAGES - 1 ? 'forward' : 'back'}
              onClick={() => page < TOTAL_PAGES - 1 ? goTo(1) : goTo(-1)}
            />
          </div>
          {pageCards.map((card, i) => {
              const isActive = activeCard === card.id
              const isDim    = activeCard !== null && !isActive
              const isEmpty  = !card.img

              return (
                <div
                  key={card.id}
                  className={
                    'vi-card' +
                    (isActive ? ' vi-card--active' : '') +
                    (isDim    ? ' vi-card--dim'    : '') +
                    (isEmpty  ? ' vi-card--empty'  : ' vi-card--filled')
                  }
                  style={{
                    left: i * PEEK + 'px',
                    zIndex: isActive ? 50 : pageCards.length - i,
                  }}
                  onMouseEnter={() => handleEnter(card.id)}
                >
                  {isEmpty ? (
                    <div className="vi-card__inset">
                      <span className="vi-card__qmark">?</span>
                    </div>
                  ) : (
                    <>
                      <div className="vi-card__bg" style={{ backgroundImage: `url('${card.img}')` }} />
                      <div className="vi-card__overlay" />
                      <div className="vi-card__body">
                        <span className="vi-card__label">{card.label}</span>
                      </div>
                      <div className="vi-card__accent" />
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>


      </div>


    </div>
  )
}

export default function Vaikuttajat() {
  return (
    <section className="vaikuttajat" id="vaikuttajat">
      <div className="vaikuttajat__inner">
        <div className="vaikuttajat__header">
          <h2 className="vaikuttajat__title">
            Käännä "SOMETON"
            <span className="vaikuttajat__title-accent">vaikuttajilla</span>
          </h2>
          <p className="vaikuttajat__lead">
            Vaikuttajaverkostomme koostuu valituista ammattilaisista, jotka ymmärtävät digitaalisen
            sisällön tekemisen, yleisöjen käyttäytymisen ja toimivien lyhytvideoiden rakentamisen.
            He luovat yrityksesi näköistä, koukuttavaa sisältöä, joka herättää kiinnostusta ja
            kasvattaa näkyvyyttä.
          </p>
        </div>
        <StackedCards />
      </div>
    </section>
  )
}
