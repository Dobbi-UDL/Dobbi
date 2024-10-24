'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import routes from "@/config/routes"
import  BrandButton  from './BrandButton'
import UserProfile from './UserProfile'
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

  const isHomepage = pathname === routes.home;
  const headerClass = isHomepage
    ? (scrollY > SCROLL_THRESHOLD ? 'bg-white shadow-md' : 'bg-transparent')
    : 'bg-white shadow-md';

  return (
    <header id="header" className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
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
          <div id="navbar-right" className="flex items-center space-x-4">
            <div id="user-profile" className="flex items-center space-x-4">
              <UserProfile />
            </div>
          </div>
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