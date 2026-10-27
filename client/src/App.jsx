/* presentation preferred*/
import { BrowserRouter, Routes, Route } from 'react-router'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Tours } from './components/Tours'
import { Testimonials } from './components/Testimonials'
import { Cta } from './components/Cta'
import { Footer } from './components/Footer'
import { Login } from './components/Login'
import { DestinationDetail } from './components/DestinationDetail'
import { OrderSuccess } from './components/OrderSuccess'

/* The home page: all the sections that used to sit directly inside App. */
function Home() {
  return (
    <>
      <Hero />
      <Tours />
      <Testimonials />
      <Cta />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login mode="login" />} />
          <Route path="/signup" element={<Login mode="signup" />} />
          <Route path="/destinations/:slug" element={<DestinationDetail />} />
          <Route path="/order/success" element={<OrderSuccess />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}

export default App