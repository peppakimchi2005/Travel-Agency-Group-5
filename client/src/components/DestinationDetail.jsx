import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router'
import { formatPrice } from '../lib/format'

export function DestinationDetail() {
  /* useParams reads the slug from the address, e.g. /destinations/bali-indonesia */
  const { slug } = useParams()
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadDestination() {
      setLoading(true)
      setNotFound(false)
      try {
        const response = await fetch(`/api/products/${slug}`)
        if (response.status === 404) {
          setNotFound(true)
          return
        }
        const data = await response.json()
        setDestination(data)
      } catch (err) {
        console.error('Failed to load destination', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadDestination()
  }, [slug])

  if (loading) {
    return <p className="mx-auto max-w-[1100px] px-6 py-16 text-blue">Loading...</p>
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        <p className="text-blue">We couldn't find that destination.</p>
        <Link to="/#destinations" className="mt-2 inline-block font-semibold text-teal underline">
          Back to destinations
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-sand">
      <div className="mx-auto grid max-w-[1100px] gap-10 px-6 py-16 md:grid-cols-2">
        <img
          src={destination.image}
          alt={destination.alt}
          className="h-[320px] w-full rounded-lg object-cover md:h-[420px]"
        />

        <div>
          <Link to="/#destinations" className="text-sm font-semibold text-teal underline">
            Back to destinations
          </Link>

          <h1 className="mt-3 text-3xl font-bold text-teal sm:text-[2.5rem]">
            {destination.name}
          </h1>

          <div className="mt-4 flex items-center gap-4">
            <span className="rounded-full bg-teal-light px-3 py-1 text-[0.9rem] font-semibold text-white">
              {destination.days} days
            </span>
            <span className="text-2xl font-bold text-blue">
              {formatPrice(destination.price)}
            </span>
          </div>

          <p className="mt-6 text-blue">{destination.text}</p>
          <p className="mt-3 text-sm text-blue">
            Flights, stays, and guides are all included in the price.
          </p>

          <button
            type="button"
            disabled
            className="mt-6 cursor-not-allowed rounded-full bg-teal px-6 py-3 font-semibold text-white opacity-50"
            title="Booking is coming soon"
          >
            Book this trip
          </button>
        </div>
      </div>
    </div>
  )
}