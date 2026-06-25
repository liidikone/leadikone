import '../styles/globals.css'
import '../styles/Tietosuoja.css'
import Navbar from '../components/Navbar'

export default function Tietosuoja() {
  return (
    <>
      <Navbar />
      <main className="tietosuoja">
        <div className="tietosuoja__inner">
          <h1 className="tietosuoja__title">Tietosuojaseloste</h1>
          <p className="tietosuoja__updated">Päivitetty: kesäkuu 2026</p>

          <section className="tietosuoja__section">
            <h2>Rekisterinpitäjä</h2>
            <p>
              SOMETON Oy<br />
              Y-tunnus: 3389796-9<br />
              Sähköposti: <a href="mailto:on@someton.net" className="tietosuoja__email">on@someton.net</a>
            </p>
          </section>

          <section className="tietosuoja__section">
            <h2>Mitä tietoja keräämme</h2>
            <p>Keräämme tietoja, joita tarvitsemme palvelujemme tarjoamiseen ja verkkosivujemme kehittämiseen. Tiedot voivat sisältää:</p>
            <ul>
              <li>Yhteydenottolomakkeen kautta annetut tiedot (nimi, yritys, sähköposti, puhelinnumero)</li>
              <li>Evästeiden ja seurantateknologioiden avulla kerätyt käyttäytymistiedot</li>
              <li>Istuntotiedot ja sivuston käyttöä koskevat tilastot</li>
            </ul>
          </section>

          <section className="tietosuoja__section">
            <h2>Evästeet</h2>
            <p>Käytämme verkkosivuillamme ensimmäisen osapuolen ja kolmannen osapuolen evästeitä sekä muita seurantateknologioita. Evästeet auttavat meitä analysoimaan sivuston käyttöä, parantamaan käyttökokemusta sekä markkinoimaan palveluitamme.</p>
            <p>Voit hallita evästeasetuksiasi selaimesi asetuksissa. Huomioithan, että evästeiden poistaminen käytöstä saattaa vaikuttaa sivuston toiminnallisuuteen.</p>
          </section>

          <section className="tietosuoja__section">
            <h2>Google Analytics</h2>
            <p>Käytämme Google Analytics -palvelua sivuston kävijätilastojen seurantaan. Google Analytics kerää anonyymejä tietoja sivuston käytöstä evästeiden avulla. Tiedot käsitellään Googlen palvelimilla. Lisätietoja Googlen tietosuojakäytännöistä löydät osoitteesta <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="tietosuoja__email">policies.google.com/privacy</a>.</p>
          </section>

          <section className="tietosuoja__section">
            <h2>Tietojen käyttötarkoitus</h2>
            <p>Käytämme keräämiämme tietoja seuraaviin tarkoituksiin:</p>
            <ul>
              <li>Yhteydenottopyyntöihin vastaaminen ja tarjousten toimittaminen</li>
              <li>Palvelujemme kehittäminen ja parantaminen</li>
              <li>Verkkosivuston analytiikka ja käyttäjäkokemuksen optimointi</li>
              <li>Markkinointiviestintä (vain suostumuksella)</li>
              <li>Lainmukaisten velvoitteiden täyttäminen</li>
            </ul>
          </section>

          <section className="tietosuoja__section">
            <h2>Tietojen säilytysaika</h2>
            <p>Säilytämme henkilötietoja niin kauan kuin se on tarpeen tässä selosteessa kuvattuihin tarkoituksiin tai lain edellyttämällä tavalla. Yhteydenottolomakkeen tiedot poistetaan 12 kuukauden kuluessa yhteydenoton käsittelystä.</p>
          </section>

          <section className="tietosuoja__section">
            <h2>Rekisteröidyn oikeudet</h2>
            <p>EU:n yleisen tietosuoja-asetuksen (GDPR) mukaisesti sinulla on oikeus:</p>
            <ul>
              <li>Saada tietoa henkilötietojesi käsittelystä (tarkastusoikeus)</li>
              <li>Vaatia virheellisten tietojen oikaisemista</li>
              <li>Vaatia tietojesi poistamista ("oikeus tulla unohdetuksi")</li>
              <li>Vastustaa tietojesi käsittelyä</li>
              <li>Siirtää tietosi toiselle rekisterinpitäjälle (tietojen siirrettävyys)</li>
              <li>Peruuttaa antamasi suostumus milloin tahansa</li>
            </ul>
          </section>

          <section className="tietosuoja__section">
            <h2>Ota yhteyttä</h2>
            <p>
              Mikäli sinulla on kysyttävää tietosuojastamme tai haluat käyttää oikeuksiasi, ota meihin yhteyttä:<br /><br />
              SOMETON Oy<br />
              Sähköposti: <a href="mailto:on@someton.net" className="tietosuoja__email">on@someton.net</a>
            </p>
            <p>Sinulla on myös oikeus tehdä valitus tietosuojaviranomaiselle. Suomessa valvova viranomainen on Tietosuojavaltuutetun toimisto.</p>
          </section>

          <a href="/" className="tietosuoja__back">Takaisin etusivulle</a>
        </div>
      </main>
    </>
  )
}
