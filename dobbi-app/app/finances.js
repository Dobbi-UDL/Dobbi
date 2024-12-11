import React from 'react';
import FinancesOverview from '../assets/components/Finances/Overview/FinancesOverview';
import FinancialDetails from '../assets/components/Finances/Details/FinancialDetails';
import TabView from '../assets/components/common/TabView';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import i18n from '../i18n';
import { useLanguage } from '@languagecontext';

const Finances = () => {
    const { locale } = useLanguage();

    return (
        <>
        <Header title='Finances' />
        <FinancialDetails />
        <BottomNavBar />
        </>
    );
};

export default Finances;