'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/auth/ui/Button"
import routes from "@/config/routes"
import  BrandButton  from './BrandButton'
import { useScroll } from "@/contexts/ScrollContext"


const NAV_LINKS = [
  { name: "Dashboard", path: routes.dashboard },
  { name: "Challenges", path: routes.challenges },
  { name: "Offers", path: routes.offers },
]

const SCROLL_THRESHOLD = 20;

export default function Navbar() {
  const pathname = usePathname()
  const { scrollY } = useScroll()

  return (
    <header id="guest-header" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > SCROLL_THRESHOLD ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <nav id="navbar" className="container mx-auto px-4">
        <div id="navbar-container" className="flex items-center justify-between h-16">
          <div id="navbar-left" className="flex items-center space-x-4">
            <BrandButton />
            <div id="navbar-links" className="hidden md:flex items-center">
              <div id="navbar-divider" className="w-px h-6 bg-gray-300 mx-4"></div>
              <div id="navbar-nav-links" className="flex space-x-4">
                {NAV_LINKS.map((link) => (
                  // If link doesn't exist yet, use a hash
                  <NavLink key={link.name} href={link.path || '#'} active={pathname === link.path}>
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <Button id="navbar-menu-button" variant="outline" className="md:hidden">
            Menu
          </Button>
        </div>
      </nav>
    </header>
  )
}

function NavLink({ href, active, children }) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium transition-colors hover:text-[#F66C72] relative group ${active ? 'text-[#F66C72]' : 'text-gray-600'
        }`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#F66C72] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${active ? 'scale-x-100' : ''}`}></span>
    </Link>
  )
}