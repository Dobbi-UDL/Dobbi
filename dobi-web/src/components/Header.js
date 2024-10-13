"use client";

import { useScroll } from "@/contexts/ScrollContext";

const BRAND_NAME = "Dobbi";
const SIGN_UP_TEXT = "Sign Up";
const LOG_IN_TEXT = "Log In";


export default function Header() {
    const { isScrolled, scrollTo } = useScroll();

    return (
        <header id="header" className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
            }`}>
            <nav id="nav" className="container mx-auto px-6 py-3">
                <div id="nav-content" className="flex items-center justify-between">
                    <button id="brand-button" onClick={() => scrollTo('hero')} className="text-2xl font-bold text-gray-800">
                        {BRAND_NAME}
                    </button>
                    <div id="auth-buttons" className="flex space-x-4">
                        <button id="sign-up-button" className="text-gray-600 hover:text-gray-900">{SIGN_UP_TEXT}</button>
                        <button id="log-in-button" className="text-gray-600 hover:text-gray-900">{LOG_IN_TEXT}</button>
                    </div>
                </div>
            </nav>
        </header>
    );
}