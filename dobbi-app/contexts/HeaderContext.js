
import React, { createContext, useContext, useState } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [hasShownBrand, setHasShownBrand] = useState(false);

    return (
        <HeaderContext.Provider value={{ hasShownBrand, setHasShownBrand }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);