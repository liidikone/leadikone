import '../styles/Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img
          src="/leadikone-bg.avif"
          alt=""
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">
          SOMESANKARIT<br />
          <span className="hero__title-glow">→LIIDIKONE</span>
        </h1>
        <p className="hero__lead">
          Muuta näyttökerrat rahaksi
        </p>
      </div>

      {/* Floating label — center/left over the hero image */}
      <p className="hero__powered-label">Kysymyksiä?<br />AI agentti vastaa</p>

      <div className="hero__powered-group">
        <img src="/synabs.png" alt="Synabs" className="hero__powered-logo" />
        <div className="hero__powered">
          <span>Powered by <a href="https://synabs.fi" target="_blank" rel="noopener noreferrer">Synabs.fi</a></span>
        </div>
      </div>
    </section>
  )
}
