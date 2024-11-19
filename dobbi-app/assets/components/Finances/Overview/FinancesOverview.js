import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BudgetSummaryCard from './BudgetSummary';
import ExpensesChart from './ExpensesChart';
import Card from '../../common/Card';
import Chart from './ChartTest';

const FinancesOverview = () => {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                <Text style={styles.headerTitle}>Finances Overview</Text>
                </View>
                <BudgetSummaryCard />
                <ExpensesChart />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#FFF5F5',
    },
    scrollView: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333333',
    },
});

export default FinancesOverview;