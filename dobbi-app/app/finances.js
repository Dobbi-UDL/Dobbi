import React from 'react';
import FinancesOverview from '../assets/components/Finances/Overview/FinancesOverview';
import FinancialDetails from '../assets/components/Finances/Details/FinancialDetails';
import TabView from '../assets/components/common/TabView';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';


const Finances = () => {
    const tabs = ['Overview', 'Details'];

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