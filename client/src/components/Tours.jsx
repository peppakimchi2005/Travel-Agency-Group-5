import { useState } from 'react'
import { destinations } from '../data/destinations'
import { FavoriteToggle } from './FavoriteToggle'

const filters = [
  { label: 'All', test: () => true },
  { label: 'Up to 5 days', test: (d) => d.days <= 5 },
  { label: '6+ days', test: (d) => d.days >= 6 },
]

/* useState: It’s the component’s memory, a place to store a value that the screen depends on. */
export function Tours() {
    /* example: 
       activeFilter & favorites: sticky note
       setActiveFilter & setFavorites: pen */
  const [activeFilter, setActiveFilter] = useState('All')
  const [favorites, setFavorites] = useState([])

  const currentFilter = filters.find((f) => f.label === activeFilter)
  const visible = destinations.filter(currentFilter.test)

  function toggleFavorite(id) {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    //     already saved?    yes: remove it              no: add it
    )
  }

  return (
    /* toLocaleString() converts the price to a formatted string. 1480 to 1,480 */
    /* .map counts the items in the filters array */
    <section id="destinations" className="bg-sand px-5 py-[30px] sm:p-[50px]">
      <h2 className="mb-5 text-[2rem] font-bold text-teal sm:text-[2.5rem]">
        Popular Destinations
      </h2>
      <p className="mb-6 text-[1.2rem] text-blue">
        Flights, stays, and guides are all included in the price.
      </p>

      <div className="mb-8 flex flex-wrap gap-3">
        {filters.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setActiveFilter(f.label)}
            className={`rounded-full px-4 py-2 font-semibold ${
              activeFilter === f.label
                ? 'bg-teal text-white'
                : 'bg-white text-teal hover:bg-lavender'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((place) => (
          <article
            key={place.id}
            className="overflow-hidden rounded-lg bg-white p-5 text-center"
          >
            <img
              src={place.image}
              alt={place.alt}
              className="block h-[200px] w-full rounded-lg object-cover"
            />
            <h3 className="mt-3 mb-2 text-lg font-bold text-teal">{place.name}</h3>
            <p className="mb-3 text-[0.9rem] text-blue">{place.text}</p>
            <div className="m-4 flex items-center justify-between border-t border-thistle pt-3">
              <span className="rounded-full bg-teal-light px-3 py-1 text-[0.9rem] font-semibold text-white">
                {place.days} days
              </span>
              
              <span className="text-[1.2rem] font-bold text-blue"> 
                ${place.price.toLocaleString()}
              </span>
            </div>
            <FavoriteToggle
              isFavorite={favorites.includes(place.id)}
              onToggle={() => toggleFavorite(place.id)}
            />
          </article>
        ))}
      </div>
    </section>
  )
}