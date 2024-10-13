import { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';

const SCROLL_THRESHOLD = 20;

const ScrollContext = createContext();

export const ScrollProvider = ({ children }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
            });
        }
    };

    return (
        <ScrollContext.Provider value={{ isScrolled, scrollTo }}>
            {children}
        </ScrollContext.Provider>
    );
};

export const useScroll = () => {
    return useContext(ScrollContext);
};
