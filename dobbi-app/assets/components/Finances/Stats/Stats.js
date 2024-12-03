
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from './Stats.styles';
import { useAuth } from '../../../../contexts/AuthContext';
import { fetchEntries, fetchCategories } from '../../../../services/financesService';
import { fetchFinancialSummary } from '../../../../services/statsService';
import { SummaryCard } from './SummaryCard';

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
            setLoading(false);
        } catch (error) {
            console.error('Error loading stats:', error);
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        console.log('Loading summary...');  
        const startDate = '2024-10-01';
        const endDate = '2024-12-30';

        try {
            const data = await fetchFinancialSummary(user.id, startDate, endDate);
            console.log('Summary:', data);
            setSummary(data);
        } catch (error) {
            console.error('Error getting summary:', error);
        }
    };

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
                    <SummaryCard summary={summary} />
                </ScrollView>
            )}
        </View>
    );
}