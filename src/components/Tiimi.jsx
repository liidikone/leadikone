import { useRef, useState } from 'react'
import '../styles/Tiimi.css'

const teamMembers = [
  { id: 1, tag: 'FOUNDER',    name: 'Placeholder' },
  { id: 2, tag: 'CO-FOUNDER', name: 'Placeholder' },
  { id: 3, tag: 'MYYJÄ',      name: 'Placeholder' },
  { id: 4, tag: 'MYYJÄ',      name: 'Placeholder' },
]

const cards = [
  { id: 1, label: 'sisallontuottaja_01', img: '/sisallontuottaja_01.avif' },
  { id: 2, label: 'sisallontuottaja_02', img: '/sisallontuottaja_02.avif' },
  { id: 3, label: 'sisallontuottaja_03', img: '/sisallontuottaja_03.avif' },
  { id: 4, label: 'sisallontuottaja_04', img: '/sisallontuottaja_04.avif' },
]

function useTickSound() {
  const audioCtx = useRef(null)
  return function playTick() {
    try {
      if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
      const ctx = audioCtx.current
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(920, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(460, ctx.currentTime + 0.07)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.11)
    } catch (_) {}
  }
}

const CARD_W = 260
const PEEK   = CARD_W * 0.40 // 40%

function StackedCards() {
  const [activeCard, setActiveCard] = useState(null)
  const playTick = useTickSound()

  function handleEnter(id) {
    if (id !== activeCard) {
      setActiveCard(id)
      playTick()
    }
  }

  return (
    <div
      className="tiimi__stack-scene"
      onMouseLeave={() => setActiveCard(null)}
      style={{ width: `${CARD_W + (cards.length - 1) * PEEK}px` }}
    >
      {cards.map((card, i) => {
        const isActive   = activeCard === card.id
        const isInactive = activeCard !== null && !isActive
        return (
          <div
            key={card.id}
            className={[
              'tiimi__card',
              isActive   ? 'tiimi__card--active'   : '',
              isInactive ? 'tiimi__card--dim' : '',
            ].filter(Boolean).join(' ')}
            style={{
              left:   `${i * PEEK}px`,
              zIndex: isActive ? 50 : cards.length - i,
            }}
            onMouseEnter={() => handleEnter(card.id)}
          >
            {/* Background image */}
            <div
              className="tiimi__card-bg"
              style={{ backgroundImage: `url('${card.img}')` }}
            />

            {/* Dark overlay */}
            <div className="tiimi__card-overlay" />

            {/* Label at 1/3 from top */}
            <div className="tiimi__card-inner">
              <span className="tiimi__card-label">{card.label}</span>
            </div>

            {/* Green accent bottom */}
            <div className="tiimi__card-accent" />
          </div>
        )
      })}
    </div>
  )
}

function Avatar({ tag, name }) {
  return (
    <div className="tiimi__member">
      <div className="tiimi__photo">
        <svg width="40" height="40" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="18" r="10" stroke="#e8e8e8" strokeWidth="2" />
          <path d="M4 44c0-11 8.954-20 20-20s20 8.954 20 20" stroke="#e8e8e8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="tiimi__member-info">
        <p className="tiimi__member-role">{tag}</p>
        <p className="tiimi__member-name">{name}</p>
        <p className="tiimi__member-bio">Placeholder bio text goes here.</p>
      </div>
    </div>
  )
}

export default function Tiimi() {
  const founders = teamMembers.slice(0, 2)
  const sellers  = teamMembers.slice(2, 4)

  return (
    <section className="tiimi" id="tiimi">
      <div className="tiimi__inner">

        {/* Header */}
        <div className="tiimi__header">
          <p className="tiimi__label">TIIMI</p>
          <h1 className="tiimi__title">Ihmiset<br />tuloksien takana</h1>
        </div>

        {/* Mission */}
        <div className="tiimi__mission">
          <p className="tiimi__mission-text">
            Somesankarit on tiimi, joka muuttaa some-näkyvyyden mitattavaksi liiketoiminnaksi.
            Jokainen meistä tuo pöytään oman erikoisosaamisensa — yhdessä teemme tulosta.
          </p>
        </div>

        {/* Row 1: Founder + Co-Founder */}
        <div className="tiimi__team tiimi__team--founders">
          {founders.map(m => <Avatar key={m.id} {...m} />)}
        </div>

        {/* Row 2: Myyjä + Myyjä */}
        <div className="tiimi__team tiimi__team--sellers">
          {sellers.map(m => <Avatar key={m.id} {...m} />)}
        </div>

        {/* Divider */}
        <div className="tiimi__divider" />

        {/* Stacked cards */}
        <div className="tiimi__cards-section">
          <p className="tiimi__label">SISÄLLÖNTUOTTAJAT</p>
          <h2 className="tiimi__cards-title">Sisältö, joka myy</h2>
          <StackedCards />
        </div>

      </div>
    </section>
  )
}
