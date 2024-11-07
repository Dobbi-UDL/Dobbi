import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import BudgetOverview from '../assets/components/Finances/BudgetOverview';
import FinancialDetails from '../assets/components/Finances/FinancialDetails';
import TabBar from '../assets/components/common/TabBar';


const Finances = () => {
    const [activeTab, setActiveTab] = useState(0);  // Track the active tab
    const tabs = ['Budget Overview', 'Financial Details'];

    return (
        <View style={styles.container}>
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={setActiveTab}
            />
            {activeTab === 0 ? <BudgetOverview /> : <FinancialDetails />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Finances;