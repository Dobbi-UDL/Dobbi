import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from './Stats.styles';
import { useAuth } from '../../../../contexts/AuthContext';
import { fetchEntries, fetchCategories } from '../../../../services/financesService';
import { fetchFinancialSummary, fetchPeriodComparison } from '../../../../services/statsService';
import { SummaryCard } from './SummaryCard';
import { PeriodComparisonCard } from './PeriodComparisonCard';

export default function Stats() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        savings: 0,
        savingsRate: 0,
    });

    const [periodComparison, setPeriodComparison] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }

        loadStatsData();

    }, [user]);

    const loadStatsData = async () => {
        try {
            console.log('Loading stats data...');
            await loadSummary();
            await loadPeriodComparison();
            setLoading(false);
        } catch (error) {
            console.error('Error loading stats:', error);
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        console.log('Loading summary...');  
        const startDate = '2024-12-01';
        const endDate = '2024-12-31';

        try {
            const data = await fetchFinancialSummary(user.id, startDate, endDate);
            console.log('Summary:', data);
            setSummary(data);
        } catch (error) {
            console.error('Error getting summary:', error);
        }
    };

    const loadPeriodComparison = async () => {
        console.log('Loading period comparison...');
        const currentStartDate = '2024-12-01';
        const currentEndDate = '2024-12-30';
        const previousStartDate = '2024-11-01';
        const previousEndDate = '2024-11-30';

        try {
            const data = await fetchPeriodComparison(user.id, currentStartDate, currentEndDate, previousStartDate, previousEndDate);
            console.log('Period comparison:', data);
            setPeriodComparison(data);
        } catch (error) {
            console.error('Error getting period comparison:', error);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStatsData();
        setRefreshing(false);
    };    

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }>
                    <SummaryCard data={summary} />
                    <PeriodComparisonCard data={periodComparison} />
                    <View style={styles.footer}/>
                </ScrollView>
            )}
        </View>
    );
}