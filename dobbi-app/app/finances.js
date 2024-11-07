import React from 'react';
import BudgetOverview from '../assets/components/Finances/BudgetOverview';
import FinancialDetails from '../assets/components/Finances/FinancialDetails';
import TabView from '../assets/components/common/TabView';

const Finances = () => {
    const tabs = ['Budget Overview', 'Financial Details'];

    return (
        <TabView tabs={tabs} tabBarStyle={tabStyles}>
            <BudgetOverview />
            <FinancialDetails />
        </TabView>
    );
};

export default Finances;