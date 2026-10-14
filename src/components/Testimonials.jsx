const testimonials = [
  {
    quote: '"WayFinder made my trip to Europe unforgettable! The itinerary was perfect and stress-free."',
    name: 'Phini S., Malaysia',
  },
  {
    quote: '"I loved the personalized service and attention to detail. Highly recommend WayFinder!"',
    name: 'Anja S., Berlin',
  },
  {
    quote: '"From start to finish, my experience with WayFinder was seamless and enjoyable."',
    name: 'Sharon H., USA',
  },
]

export function Testimonials() {
  return (
    <section id="testimonial" className="bg-teal px-5 py-[30px] sm:p-[50px]">
      <h2 className="mb-10 text-[2rem] font-bold text-white sm:text-[2.5rem]">
        What our travelers say
      </h2>

      <div className="grid grid-cols-1 gap-6 min-[901px]:grid-cols-3">
        {testimonials.map((item) => (
          <div key={item.name} className="rounded-lg bg-sand p-6">
            <p className="italic text-blue">{item.quote}</p>
            <h4 className="mt-4 font-bold text-teal">- {item.name}</h4>
          </div>
        ))}
      </div>
    </section>
  )
}