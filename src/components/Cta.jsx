export function Cta() {
  return (
    <section id="cta" className="bg-sand px-5 py-[30px] sm:p-[50px]">
      <div className="mx-auto max-w-[800px] rounded-2xl bg-teal px-6 py-10 text-center sm:px-10 sm:py-[60px]">
        <h2 className="text-[1.8rem] font-bold text-white sm:text-[2.2rem]">
          Ready to go somewhere new?
        </h2>
        <p className="mt-4 mb-[30px] text-[1.2rem] text-lavender">
          Tell us where you'd like to go and we will build a plan around you.
        </p>
        <a
          href="mailto:hello@wayfinder.example"
          className="inline-block rounded-full bg-gold px-7 py-3.5 font-semibold text-teal hover:bg-gold-dark"
        >
          Plan your trip
        </a>
      </div>
    </section>
  )
}