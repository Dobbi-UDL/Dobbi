"use client";

import { createContext, useState, useEffect, useContext } from 'react';

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    });

    const scrollTo = (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    return (
        <ScrollContext.Provider value={{ scrollY, scrollTo }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => {
    return useContext(ScrollContext);
};
