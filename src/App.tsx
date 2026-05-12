import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { LanguageProvider } from './i18n/LanguageContext'
import LanguageOverlay from './components/LanguageOverlay'

// Components
import Navbar from './components/Navbar'
import AgencySchema from './components/AgencySchema'
import Hero from './components/Hero'
import Features from './components/Features'
import Manifesto from './components/Manifesto'
import Archive from './components/Archive'
import Gallery from './components/Gallery'
import Pricing from './components/Pricing'
import Footer from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    return () => {
      ScrollTrigger.killAll()
    }
  }, [])

  return (
    <LanguageProvider>
      <div className="bg-void min-h-screen text-cream">
        <AgencySchema />
        <LanguageOverlay />
        <Navbar />
        <Hero />
        <Features />
        <Manifesto />
        <Archive />
        <Gallery />
        <Pricing />
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App
