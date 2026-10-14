/* presentation preferred*/
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Tours } from './components/Tours'
import { Testimonials } from './components/Testimonials'
import { Cta } from './components/Cta'
import { Footer } from './components/Footer'

function App() {

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Tours />
        <Testimonials />
        <Cta />
      </main>
      <Footer />
    </>
  )
}

export default App
