import { useEffect } from 'react'
import './styles/globals.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Palvelut from './components/Palvelut'
import Vaikuttajat from './components/Vaikuttajat'
import Hinnoittelu from './components/Hinnoittelu'
import Tiimi from './components/Tiimi'

export default function App() {
  // Remove bg-light — always dark hero background
  useEffect(() => {
    document.documentElement.classList.remove('bg-light')
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Palvelut />
        <Vaikuttajat />
        <Hinnoittelu />
        <Tiimi />
      </main>
    </>
  )
}
