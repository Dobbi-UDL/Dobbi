import React from 'react';
import FinancesOverview from '../assets/components/Finances/Overview/FinancesOverview';
import FinancialDetails from '../assets/components/Finances/Details/FinancialDetails';
import TabView from '../assets/components/common/TabView';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';
import i18n from '../i18n';

const Finances = () => {
    const tabs = [i18n.t('overview'), i18n.t('details')];

    return (
        <>
        <Header />
        <TabView tabs={tabs}>
            <FinancesOverview />
            <FinancialDetails />
        </TabView>
        <BottomNavBar />
        </>
    );
};

export default Finances;