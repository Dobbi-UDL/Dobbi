'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useScroll } from "@/contexts/ScrollContext"
import routes from "@/config/routes"

// Text Constants
const BRAND_NAME = "Dobbi"

const NAV_LINKS = [
  { name: "Dashboard", path: routes.dashboard },
  { name: "Challenges", path: routes.challenges },
  { name: "Offers", path: routes.offers },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-gray-800">
              {BRAND_NAME}
            </Link>
            <div className="hidden md:flex items-center">
              <div className="w-px h-6 bg-gray-300 mx-4"></div>
              <div className="flex space-x-4">
                {NAV_LINKS.map((link) => (
                  // If link doesn't exist yet, use a hash
                  <NavLink href={link.path || '#' } active={pathname === link.path}>
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
          <Button variant="outline" className="md:hidden">
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
      className={`text-sm font-medium transition-colors hover:text-primary ${
        active ? 'text-primary' : 'text-muted-foreground'
      }`}
    >
      {children}
    </Link>
  )
}