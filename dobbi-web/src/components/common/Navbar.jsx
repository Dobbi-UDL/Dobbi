"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import routes from "@/config/routes";
import BrandButton from "./BrandButton";
import UserProfile from "./UserProfile";
import { useScroll } from "@/contexts/ScrollContext";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { name: "Dashboard", path: routes.dashboard },
  { name: "Challenges", path: routes.challenges },
  { name: "Offers", path: routes.offers },
];

const ADMIN_NAV_LINKS = [
  { name: "Companies", path: routes.companies },
  { name: "Admins", path: routes.admins },
  { name: "Users", path: routes.users },
];

const SCROLL_THRESHOLD = 20;

export default function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { isAdmin } = useAuth();

  const isHomepage = pathname === routes.home;
  const headerClass = isHomepage
    ? scrollY > SCROLL_THRESHOLD
      ? "bg-white shadow-md"
      : "bg-transparent"
    : "bg-white shadow-md";

  return (
    <header
      id="header"
      className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}
    >
      <nav id="navbar" className="container mx-auto px-4">
        <div
          id="navbar-container"
          className="flex items-center justify-between h-16"
        >
          <div id="navbar-left" className="flex items-center space-x-4">
            <BrandButton />
            <div id="navbar-links" className="hidden md:flex items-center">
              <div
                id="navbar-divider"
                className="w-px h-6 bg-gray-300 mx-4"
              ></div>
              <div id="navbar-nav-links" className="flex space-x-4">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.name}
                    href={link.path}
                    active={pathname === link.path}
                  >
                    {link.name}
                  </NavLink>
                ))}
                {isAdmin &&
                  ADMIN_NAV_LINKS.map((link) => (
                    <NavLink
                      key={link.name}
                      href={link.path}
                      active={pathname === link.path}
                    >
                      {link.name}
                    </NavLink>
                  ))}
              </div>
            </div>
          </div>
          <div id="navbar-right" className="flex items-center space-x-4">
            <UserProfile />
          </div>
        </div>
      </nav>
    </header>
  );
}

const NavLink = ({ href, active, children }) => (
  <Link href={href} className={`nav-link ${active ? "active" : ""}`}>
    {children}
  </Link>
);
