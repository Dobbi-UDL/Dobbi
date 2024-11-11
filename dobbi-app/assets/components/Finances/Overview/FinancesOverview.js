import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BudgetSummaryCard from './BudgetSummary';
import ExpensesChart from './ExpensesChart';
import Card from '../../common/Card';
import Chart from './ChartTest';

const FinancesOverview = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Finances Overview</Text>
            <BudgetSummaryCard />
            <ExpensesChart />
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF5F6',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default FinancesOverview;