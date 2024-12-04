import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { styles } from './Stats.styles';
import { useAuth } from '../../../../contexts/AuthContext';
import { fetchEntries, fetchCategories } from '../../../../services/financesService';
import { fetchFinancialSummary, fetchPeriodComparison, fetchCategoryDistribution } from '../../../../services/statsService';
import { SummaryCard } from './SummaryCard';
import { PeriodComparisonCard } from './PeriodComparisonCard';
import { CategoryDistributionCard } from './CategoryDistributionCard';
import { TopCategoriesCard } from './TopCategoriesCard';

export default function Stats() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Data for summary card
    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        savings: 0,
        savingsRate: 0,
    });

    // Data for period comparison card
    const [periodComparison, setPeriodComparison] = useState([]);

    // Data for category distribution card
    const [expenseCategories, setExpenseCategories] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState([]);

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
            await loadCategoryDistribution();
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

    const loadCategoryDistribution = async () => {
        console.log('Loading category distribution...');
        const startDate = '2024-12-01';
        const endDate = '2024-12-31';

        try {
            const { expenseData, incomeData } = await fetchCategoryDistribution(user.id, startDate, endDate);
            console.log('Expense categories:', expenseData);
            console.log('Income categories:', incomeData);
            setExpenseCategories(expenseData);
            setIncomeCategories(incomeData);
        }
        catch (error) {
            console.error('Error getting category distribution:', error);
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
                    <TopCategoriesCard 
                        title="Top Expense Categories"
                        data={expenseCategories}
                        type="expense"
                    />
                    <TopCategoriesCard 
                        title="Top Income Categories"
                        data={incomeCategories}
                        type="income"
                    />
                    <CategoryDistributionCard
                        data={expenseCategories}
                        title="Expense Categories"
                        height={300}
                        padding={{ top: 0, bottom: 0, left: 55, right: 50 }}
                    />
                    <CategoryDistributionCard
                        data={incomeCategories}
                        title="Income Categories"
                        startAngle={270}
                        endAngle={450}
                        height={150}
                        padding={{ top: 0, bottom: -160, left: 55, right: 50 }}
                    />
                    <View style={styles.footer}/>
                </ScrollView>
            )}
        </View>
    );
}