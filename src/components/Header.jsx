const links = [
  { label: 'Home', href: '#hero' },
  { label: 'Tours', href: '#destinations' },
  { label: 'Stories', href: '#testimonial' },
  { label: 'Contact', href: '#cta' },
]

export function Header() {
  return (
    <header>
      <div className="bg-sand flex flex-col items-center py-2.5 sm:flex-row sm:justify-between sm:py-0">
        <a href="#" className="text-[2rem] font-bold text-teal pt-[5px] sm:pl-[50px]">
          WayFinder
        </a>

        <nav>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2.5 my-2.5 sm:my-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-teal hover:text-lilac sm:pr-[35px]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}