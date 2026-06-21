import { useRef, useState } from 'react'
import '../styles/Tiimi.css'

const teamMembers = [
  { id: 1, tag: 'FOUNDER',          name: 'Santeri Koskinen', img: '/santeri.avif', phone: '+358 50 123 1234', email: 'santeri@palceholder.com' },
  { id: 2, tag: 'CO-FOUNDER',       name: 'Jani Karkulahti',  img: '/jani.avif',    phone: '+358 40 123 1234', email: 'jani@placeholder.com' },
  { id: 3, tag: 'ASIAKASPÄÄLLIKKÖ', name: 'Placeholder', email: 'kasvu@placeholder.com' },
  { id: 4, tag: 'ASIAKASPÄÄLLIKKÖ', name: 'Placeholder', email: 'kasvu@placeholder.com' },
]

const cards = [
  { id: 1, label: 'Anniina',  img: '/sisallontuottaja_01.avif' },
  { id: 2, label: 'Pauliina', img: '/sisallontuottaja_01.avif' },
  { id: 3, label: 'Santeri',  img: '/sisallontuottaja_01.avif' },
  { id: 4, label: 'Veera',    img: '/sisallontuottaja_01.avif' },
]

const CARD_W = 260
const PEEK   = Math.round(CARD_W * 0.40)

function useCardSound() {
  const audioCtx = useRef(null)

  function getCtx() {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Selaimet luovat AudioContextin "suspended"-tilassa: ilman resume()-kutsua
    // sen kello ei etene, äänet jonottuvat ja purkautuvat myöhemmin yhtenä
    // kovana ryöppynä. Herätetään konteksti aina ennen soittoa.
    if (audioCtx.current.state === 'suspended') {
      audioCtx.current.resume()
    }
    return audioCtx.current
  }

  return function playCardSound() {
    try {
      const ctx = getCtx()
      const now = ctx.currentTime

      // Kevyt "naps→shuush": lyhyt kohinapyrähdys jonka taajuus liukuu
      // alaspäin — napsahtava alku, pehmeä häivytys, ei syvää bassoa.
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
  }
}

function StackedCards() {
  const [activeCard, setActiveCard] = useState(null)
  const playCardSound = useCardSound()
  const stackWidth = CARD_W + (cards.length - 1) * PEEK

  function handleEnter(id) {
    if (id !== activeCard) { setActiveCard(id); playCardSound() }
  }

  return (
    <div
      className="tc-scene"
      style={{ width: stackWidth + 'px', height: '380px' }}
      onMouseLeave={() => setActiveCard(null)}
    >
      {cards.map((card, i) => {
        const isActive   = activeCard === card.id
        const isDim      = activeCard !== null && !isActive
        return (
          <div
            key={card.id}
            className={'tc-card' + (isActive ? ' tc-card--active' : '') + (isDim ? ' tc-card--dim' : '')}
            style={{ left: i * PEEK + 'px', zIndex: isActive ? 50 : cards.length - i }}
            onMouseEnter={() => handleEnter(card.id)}
          >
            <div className="tc-card__bg" style={{ backgroundImage: `url('${card.img}')` }} />
            <div className="tc-card__overlay" />
            <div className="tc-card__body">
              <span className="tc-card__label">{card.label}</span>
            </div>
            <div className="tc-card__accent" />
          </div>
        )
      })}
    </div>
  )
}

function Member({ tag, name, img, phone, email }) {
  return (
    <div className="tm-card">
      <div className="tm-avatar">
        {img ? (
          <img src={img} alt={name} className="tm-avatar__img" />
        ) : (
          <svg width="36" height="36" viewBox="0 0 48 48" fill="none" aria-hidden="true">
            <circle cx="24" cy="18" r="10" stroke="#cccccc" strokeWidth="2" />
            <path d="M4 44c0-11 8.954-20 20-20s20 8.954 20 20" stroke="#cccccc" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>
      <p className="tm-role">{tag}</p>
      <p className="tm-name">{name}</p>
      <div className="tm-contact">
        {phone && <a href={`tel:${phone.replace(/\s+/g, '')}`} className="tm-contact__link">{phone}</a>}
        {email && <a href={`mailto:${email}`} className="tm-contact__link">{email}</a>}
      </div>
    </div>
  )
}

export default function Tiimi() {
  return (
    <section className="tiimi-page">
      <div className="tiimi-page__inner">

        <div className="tiimi-page__header">
          <h1 className="tiimi-page__title">Ihmiset kasvun takana</h1>
        </div>

        <div className="tiimi-page__mission">
          <p className="tiimi-page__mission-text">
            Liidikone ei arvaile algoritmeja, me ymmärrämme niitä. Yhdistämme datan, luovuuden,
            rohkeuden ja oivallukset sisällöksi, joka erottuu, tavoittaa oikean yleisön ja muuttaa näkyvyyden kasvuksi.
          </p>
        </div>

        <div className="tiimi-page__cards-section">
          <h2 className="tiimi-page__cards-title">SISÄLLÖNTUOTTAJAT</h2>
          <StackedCards />
        </div>

        <hr className="tiimi-page__hr" />

        <div className="tiimi-page__grid tiimi-page__grid--sellers">
          {teamMembers.slice(2, 4).map(m => <Member key={m.id} {...m} />)}
        </div>

        <div className="tiimi-page__grid tiimi-page__grid--founders">
          {teamMembers.slice(0, 2).map(m => <Member key={m.id} {...m} />)}
        </div>

      </div>
    </section>
  )
}
