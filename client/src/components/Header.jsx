import { Link } from 'react-router'
import { useSession, signOut } from '../lib/auth-client'

/* The links start with "/" so they also work from the login page:
   "/#hero" means "go to the home page, then scroll to #hero". */
const links = [
  { label: 'Home', href: '/#hero' },
  { label: 'Tours', href: '/#destinations' },
  { label: 'Stories', href: '/#testimonial' },
  { label: 'Contact', href: '/#cta' },
]

export function Header() {
  /* useSession tells us who is logged in. session?.user is empty when nobody is. */
  const { data: session } = useSession()

  return (
    <header>
      <div className="bg-sand flex flex-col items-center py-2.5 sm:flex-row sm:justify-between sm:py-0">
        <Link to="/" className="text-[2rem] font-bold text-teal pt-[5px] sm:pl-[50px]">
          WayFinder
        </Link>

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

            {session?.user ? (
              <li>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="cursor-pointer text-teal hover:text-lilac sm:pr-[35px]"
                >
                  Sign out
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  className="text-teal hover:text-lilac sm:pr-[35px]"
                >
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}