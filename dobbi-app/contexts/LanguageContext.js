// contexts/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [locale, setLocale] = useState(i18n.locale);

    useEffect(() => {
        loadSavedLanguage();
    }, []);

    const loadSavedLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('userLanguage');
            if (savedLanguage) {
                await changeLanguage(savedLanguage);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        }
    };

    const changeLanguage = async (lang) => {
        try {
            await AsyncStorage.setItem('userLanguage', lang);
            i18n.locale = lang;
            setLocale(lang);
        } catch (error) {
            console.error('Error setting language:', error);
        }
    };

    return (
        <LanguageContext.Provider value={{ locale, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);