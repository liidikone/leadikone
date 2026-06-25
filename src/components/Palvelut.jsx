import { useEffect, useRef, useState } from 'react'
import '../styles/Palvelut.css'

const services = [
  { id: 1, title: 'Lyhytvideot',            text: 'Lisäävät näkyvyyttä ja kasvattavat liidien määrää',   image: '/video.avif', bgPosition: 'center center' },
  { id: 2, title: 'Verkkosivut',            text: 'Rakennettu tuottamaan liidejä funnelien avulla',        image: '/www.avif',   bgPosition: 'center calc(50% - 1px)' },
  { id: 3, title: 'Kehittyvät AI agentit',  text: 'Automatisoivat asiakaspalvelua ja liidien keruuta',    image: '/ai.avif',    bgPosition: 'center center' },
]

function ServiceCard({ title, text, image, bgPosition }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.55 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`ps-card${active ? ' ps-card--color' : ''}`} ref={ref}>
      <div className="ps-card__bg" style={{ backgroundImage: `url('${image}')`, backgroundPosition: bgPosition }} />
      <div className="ps-card__overlay" />
      <div className="ps-card__body">
        <h3 className="ps-card__title">{title}</h3>
        <p className="ps-card__text">{text}</p>
      </div>
    </div>
  )
}

export default function Palvelut() {
  return (
    <section className="palvelut-page" id="palvelut">
      <div className="palvelut-page__inner">

        <div className="palvelut-page__header">
          <h2 className="palvelut-page__title">
            HUOMI<span className="palvelut-page__title-on">ON</span>
            <span className="palvelut-page__title-accent">keskipiste</span>
          </h2>
        </div>

        <div className="palvelut-page__mission">
          <p className="palvelut-page__mission-text">
            Et voi välttää digitaalista muutosta, mutta voit olla näkyvillä siellä, missä asiakkaiden kiinnostus syntyy. SOMET<span className="palvelut-page__title-on">ON</span> auttaa pitämään markkinointisi ajan tasalla ja tavoittamaan oikeat ihmiset oikeaan aikaan hakukoneissa, somessa, verkkosivuilla ja mainonnassa.
          </p>
        </div>

        <div className="palvelut-page__services">
          {services.map(s => <ServiceCard key={s.id} {...s} />)}
        </div>

      </div>
    </section>
  )
}
