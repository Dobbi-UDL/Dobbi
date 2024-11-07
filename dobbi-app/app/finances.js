import React from 'react';
import BudgetOverview from '../assets/components/Finances/BudgetOverview';
import FinancialDetails from '../assets/components/Finances/FinancialDetails';
import TabView from '../assets/components/common/TabView';

const Finances = () => {
    const tabs = ['Overview', 'Details'];

    return (
        <TabView tabs={tabs}>
            <BudgetOverview />
            <FinancialDetails />
        </TabView>
    );
};

export default Finances;