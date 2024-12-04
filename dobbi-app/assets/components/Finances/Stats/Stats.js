import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { styles } from './Stats.styles';
import { useAuth } from '../../../../contexts/AuthContext';
import { fetchEntries, fetchCategories } from '../../../../services/financesService';
import { fetchFinancialSummary, fetchPeriodComparison, fetchCategoryDistribution, fetchMonthlyIncomeExpensesTrend } from '../../../../services/statsService';
import { SummaryCard } from './SummaryCard';
import { PeriodComparisonCard } from './PeriodComparisonCard';
import { CategoryDistributionCard } from './CategoryDistributionCard';
import { TopCategoriesCard } from './TopCategoriesCard';
import { MonthlyTrendCard } from './MonthlyTrendCard';

export default function Stats() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

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

    // Data for monthly income vs expenses trend card
    const [monthlyTrend, setMonthlyTrend] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }

        loadStatsData();

    }, [user]);

    const loadStatsData = async () => {
        try {
            await loadSummary();
            await loadPeriodComparison();
            await loadCategoryDistribution();
            await loadMonthlyTrend();
            setLoading(false);
        } catch (error) {
            console.error('Error loading stats:', error);
            setLoading(false);
        }
    };

    const loadSummary = async () => {
        const startDate = '2024-12-01';
        const endDate = '2024-12-31';

        try {
            const data = await fetchFinancialSummary(user.id, startDate, endDate);
            setSummary(data);
        } catch (error) {
            console.error('Error getting summary:', error);
        }
    };

    const loadPeriodComparison = async () => {
        const currentStartDate = '2024-12-01';
        const currentEndDate = '2024-12-30';
        const previousStartDate = '2024-11-01';
        const previousEndDate = '2024-11-30';

        try {
            const data = await fetchPeriodComparison(user.id, currentStartDate, currentEndDate, previousStartDate, previousEndDate);
            setPeriodComparison(data);
        } catch (error) {
            console.error('Error getting period comparison:', error);
        }
    }

    const loadCategoryDistribution = async () => {
        const startDate = '2024-12-01';
        const endDate = '2024-12-31';

        try {
            const { expenseData, incomeData } = await fetchCategoryDistribution(user.id, startDate, endDate);
            setExpenseCategories(expenseData);
            setIncomeCategories(incomeData);
        }
        catch (error) {
            console.error('Error getting category distribution:', error);
        }
    }

    const loadMonthlyTrend = async () => {
        const startDate = '2024-06-01';
        const endDate = '2024-12-31';

        try {
            const data = await fetchMonthlyIncomeExpensesTrend(user.id, startDate, endDate);
            console.log('monthlyTrend:', data);
            setMonthlyTrend(data);
        } catch (error) {
            console.error('Error getting monthly trend:', error);
        }
    }

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStatsData();
        setRefreshing(false);
    };    

    const renderTabContent = () => {
        switch (selectedTab) {
            case 0: // Overview
                return (
                    <>
                        <SummaryCard data={summary} />
                        <MonthlyTrendCard data={monthlyTrend} />
                    </>
                );
            case 1: // Comparisons
                return (
                    <>
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
                        <PeriodComparisonCard data={periodComparison} />
                    </>
                );
            case 2: // Categories
                return (
                    <>
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
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <SegmentedControl
                        values={['Overview', 'Comparisons', 'Categories']}
                        selectedIndex={selectedTab}
                        onChange={(event) => {
                            setSelectedTab(event.nativeEvent.selectedSegmentIndex);
                        }}
                        style={styles.segmentedControl}
                        tintColor="#EE6567"
                        fontStyle={{color: '#333333'}}
                    />
                    <ScrollView
                        style={styles.scrollView}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                        {renderTabContent()}
                        <View style={styles.footer}/>
                    </ScrollView>
                </>
            )}
        </View>
    );
}