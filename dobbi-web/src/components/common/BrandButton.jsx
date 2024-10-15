'use client';

import { useScroll } from "@/contexts/ScrollContext";
import routes from '@/config/routes';

const BrandButton = () => {
    const { scrollTo } = useScroll();

    const handleBrandButtonClick = () => {
        if (window.location.pathname === routes.home) {
            scrollTo('hero');
        } else {
            window.location.href = routes.home;
        }
    };

    return (
        <button 
            id="brand-button"
            className="text-2xl font-bold text-gray-800 xl:mr-auto"
            onClick={handleBrandButtonClick}>
            Dobbi
        </button>
    );
};

export default BrandButton;