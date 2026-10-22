export function Hero() {
  return (
    <section
      id="hero"
      className="bg-teal bg-[url('/images/hero.jpg')] bg-cover px-6 pt-8 pb-10 sm:pl-[50px] sm:pt-5 sm:pb-[50px]"
    >
      <h1 className="text-[2.5rem] font-bold text-white max-w-[400px] my-6 sm:text-5xl lg:text-6xl">
        See the world without the stress
      </h1>
      <p className="text-[1.2rem] text-white max-w-[600px] pb-5 sm:text-2xl">
        Join thousands of satisfied travelers who have discovered the joy of
        stress-free exploration with WayFinder.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="#cta"
          className="inline-block rounded-full bg-gold px-7 py-3.5 font-semibold text-teal hover:bg-gold-dark"
        >
          Plan your trip
        </a>
        <a
          href="#destinations"
          className="inline-block rounded-full border-2 border-white px-7 py-3.5 font-semibold text-white hover:bg-teal-hover"
        >
          Browse tours
        </a>
      </div>
    </section>
  )
}