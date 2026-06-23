import { useRef, useState, useEffect, useCallback } from 'react'
import '../styles/Vaikuttajat.css'

const CARD_W = 260
const CARDS_PER_PAGE = 8
const TOTAL_CARDS = 16

function useCardSound() {
  const audioCtx = useRef(null)

  // Pre-init AudioContext on first user gesture anywhere on the page
  useEffect(() => {
    function initCtx() {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
      }
    }
    window.addEventListener('pointerdown', initCtx, { once: true })
    return () => window.removeEventListener('pointerdown', initCtx)
  }, [])

  return useCallback(function playCardSound() {
    try {
      if (!audioCtx.current) {
        audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const ctx = audioCtx.current
      if (ctx.state === 'suspended') ctx.resume()

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
      const bandpass = ctx.createBiquadFilter()
      bandpass.type = 'bandpass'
      bandpass.Q.value = 0.6
      bandpass.frequency.setValueAtTime(4200, now)
      bandpass.frequency.exponentialRampToValueAtTime(1500, now + dur)
      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.1, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + dur)
      noise.connect(bandpass)
      bandpass.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(now)
      noise.stop(now + dur)
    } catch (_) {}
  }, [])
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

const totalPages = Math.ceil(TOTAL_CARDS / CARDS_PER_PAGE)

function StackedCards() {
  const [activeCard, setActiveCard] = useState(null)
  const [page, setPage] = useState(0)
  const playCardSound = useCardSound()

  const pageCards = influencers.slice(page * CARDS_PER_PAGE, (page + 1) * CARDS_PER_PAGE)
  const PEEK = Math.round(CARD_W * 0.40)
  const stackWidth = CARD_W + (pageCards.length - 1) * PEEK

  function handleEnter(id) {
    if (id !== activeCard) {
      setActiveCard(id)
      playCardSound()
    }
  }

  function handlePageChange(newPage) {
    setActiveCard(null)
    setPage(newPage)
  }

  return (
    <div className="vi-wrapper">
      <div
        className="vi-scene-wrap"
        onMouseLeave={() => setActiveCard(null)}
      >
        <div
          className="vi-scene"
          style={{ width: stackWidth + 'px', height: '380px' }}
        >
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
                style={{ left: i * PEEK + 'px', zIndex: isActive ? 50 : pageCards.length - i }}
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

      {/* Slider / pagination */}
      <div className="vi-pagination">
        <div className="vi-slider-track">
          <input
            type="range"
            min={0}
            max={totalPages - 1}
            value={page}
            onChange={e => handlePageChange(Number(e.target.value))}
            className="vi-slider"
            aria-label="Selaa vaikuttajia"
          />
        </div>
        <div className="vi-page-dots">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              className={'vi-dot' + (i === page ? ' vi-dot--active' : '')}
              onClick={() => handlePageChange(i)}
              aria-label={`Sivu ${i + 1}`}
            />
          ))}
        </div>
        <span className="vi-page-label">{page + 1} / {totalPages}</span>
      </div>
    </div>
  )
}

export default function Vaikuttajat() {
  return (
    <section className="vaikuttajat" id="vaikuttajat">
      <div className="vaikuttajat__inner">

        <div className="vaikuttajat__header">
          <h2 className="vaikuttajat__title">Vaikuttajat</h2>
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
