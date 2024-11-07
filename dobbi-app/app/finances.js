import React from 'react';
import FinancesOverview from '../assets/components/Finances/Overview/FinancesOverview';
import FinancialDetails from '../assets/components/Finances/Details/FinancialDetails';
import TabView from '../assets/components/common/TabView';

const Finances = () => {
    const tabs = ['Overview', 'Details'];

    return (
        <TabView tabs={tabs}>
            <FinancesOverview />
            <FinancialDetails />
        </TabView>
    );
};

export default Finances;