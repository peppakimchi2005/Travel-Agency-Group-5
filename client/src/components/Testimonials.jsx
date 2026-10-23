import { useState, useEffect } from 'react'

export function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const response = await fetch('/api/testimonials')
        if (!response.ok) throw new Error('Request failed')
        const data = await response.json()
        setTestimonials(data)
      } catch (err) {
        console.error('Failed to load testimonials', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    loadTestimonials()
  }, [])

  return (
    <section id="testimonial" className="bg-teal px-5 py-[30px] sm:p-[50px]">
      <h2 className="mb-10 text-[2rem] font-bold text-white sm:text-[2.5rem]">
        What our travelers say
      </h2>

      {loading ? (
        <p className="text-white">Loading stories...</p>
      ) : error ? (
        <p className="text-white">
          We couldn't load the stories. Refresh the page to try again.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div key={item.id} className="rounded-lg bg-sand p-6">
              <p className="italic text-blue">{item.quote}</p>
              <h4 className="mt-4 font-bold text-teal">- {item.name}</h4>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}