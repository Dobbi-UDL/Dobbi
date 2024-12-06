import React, { useEffect, useState } from 'react';
import { View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import TabBar from '../../common/TabBar';
import { styles } from './Stats.styles';
import { useAuth } from '../../../../contexts/AuthContext';
import { fetchEntries, fetchCategories } from '../../../../services/financesService';
import { fetchFinancialSummary, fetchPeriodComparison, fetchCategoryDistribution, fetchMonthlyIncomeExpensesTrend } from '../../../../services/statsService';
import { SummaryCard } from './SummaryCard';
import { PeriodComparisonCard } from './PeriodComparisonCard';
import { CategoryDistributionCard } from './CategoryDistributionCard';
import { TopCategoriesCard } from './TopCategoriesCard';
import { MonthlyTrendCard } from './MonthlyTrendCard';
import { PeriodSelector } from './PeriodSelector';
import { ExportButton } from '../Export/ExportButton';
import { calculateMetrics } from './MetricsUtility';

export default function Stats() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
    const [currentPeriodDates, setCurrentPeriodDates] = useState(null);
    const [previousPeriodDates, setPreviousPeriodDates] = useState(null);
    const [metrics, setMetrics] = useState(null);

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

    const getPeriodDates = (periodId) => {
        const now = new Date();
        let startDate, endDate;

        switch (periodId) {
            case 'thisMonth':
                // Shows data for the current month up to the current date
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = now;
                break;
            case 'lastMonth':
                // Shows data for the previous month
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
                break;
            case 'last3Months':
                // Shows data for the last 3 months. Not including the current month
                startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0); 
                break;
            case 'last6Months':
                // Shows data for the last 6 months. Not including the current month
                startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                break;
            case 'yearToDate':
                // Shows data from January 1st to the current date
                startDate = new Date(now.getFullYear(), 0, 1); // January 1st
                endDate = now;
                break;
            case 'lastYear':
                // Shows data for the previous year
                startDate = new Date(now.getFullYear() - 1, 0, 1); // January 1st of previous year
                endDate = new Date(now.getFullYear() - 1, 11, 31); // December 31st of previous year
                break;
            case 'customRange':
                // This would need additional UI and logic to handle custom date selection
                // Choose random dates for now 24/09/15 - 24/11/08
                startDate = new Date(2024, 11, 2);
                endDate = new Date(2024, 11, 8);
                break;
            default:
                console.error('Invalid periodId:', periodId);
                return null;
        }

        // Set time to noon to avoid timezone issues
        startDate.setHours(12, 0, 0, 0); 
        endDate.setHours(12, 0, 0, 0); 

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    };

    const getPreviousPeriodDates = (periodId, currentStartDate = null, currentEndDate = null) => {
        const now = new Date();
        let startDate, endDate;

        switch (periodId) {
            case 'thisMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                break;
            case 'lastMonth':
                startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 1, 0);
                break;
            case 'last3Months':
                startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 3, 0);
                break;
            case 'last6Months':
                startDate = new Date(now.getFullYear(), now.getMonth() - 12, 1);
                endDate = new Date(now.getFullYear(), now.getMonth() - 6, 0);
                break;
            case 'yearToDate':
                startDate = new Date(now.getFullYear() - 1, 0, 1);
                endDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
            case 'lastYear':
                startDate = new Date(now.getFullYear() - 2, 0, 1);
                endDate = new Date(now.getFullYear() - 2, 11, 31);
                break;
            case 'customRange':
                if (currentStartDate && currentEndDate) {
                    const currentStart = new Date(currentStartDate);
                    const currentEnd = new Date(currentEndDate);

                    const duration = (currentEnd - currentStart) + (24 * 60 * 60 * 1000); // Include end day
                    
                    startDate = new Date(currentStart.getTime() - duration);
                    endDate = new Date(currentStart.getTime() - (24 * 60 * 60 * 1000)); // One day before current start
                } else {
                    console.error('Custom range requires currentStartDate and currentEndDate');
                    return null;
                }
                break;
            default:
                console.error('Invalid periodId:', periodId);
                return null;
        }

        startDate.setHours(12, 0, 0, 0);
        endDate.setHours(12, 0, 0, 0);
        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    };

    useEffect(() => {
        if (user) {
            const dates = getPeriodDates(selectedPeriod);
            const previousDates = getPreviousPeriodDates(selectedPeriod, dates.startDate, dates.endDate);
            
            // Set dates immediately
            setCurrentPeriodDates(dates);
            setPreviousPeriodDates(previousDates);
            
            // Don't show loading for quick refreshes
            const loadingTimeout = setTimeout(() => setLoading(true), 1000);
            // Start loading immediately
            loadStatsData(dates, previousDates).finally(() => {
                clearTimeout(loadingTimeout);
                setLoading(false);
            });

            return () => clearTimeout(loadingTimeout);
        }
    }, [user, selectedPeriod]);

    const loadStatsData = async (dates, prevDates) => {
        if (!dates || !prevDates) return;

        const { startDate, endDate } = dates;
        const { startDate: previousStartDate, endDate: previousEndDate } = prevDates;

        try {
            // Load data in parallel for better performance
            const [summaryData, periodCompData, categoryData, trendData] = await Promise.all([
                fetchFinancialSummary(user.id, startDate, endDate),
                fetchPeriodComparison(user.id, startDate, endDate, previousStartDate, previousEndDate),
                fetchCategoryDistribution(user.id, startDate, endDate),
                fetchMonthlyIncomeExpensesTrend(user.id, startDate, endDate)
            ]);

            // Batch state updates
            const updates = () => {
                setSummary(summaryData);
                setPeriodComparison(periodCompData);
                setExpenseCategories(categoryData.expenseData);
                setIncomeCategories(categoryData.incomeData);
                setMonthlyTrend(trendData);
                
                if (trendData?.length > 0) {
                    setMetrics(calculateMetrics(trendData));
                }
            };

            // Execute all state updates in one batch
            updates();

        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const calculateMonthlyAverages = (monthlyTrendData) => {
        if (!monthlyTrendData?.length) return null;
        
        const sum = monthlyTrendData.reduce((acc, month) => ({
            income: acc.income + month.total_income,
            expenses: acc.expenses + month.total_expenses
        }), { income: 0, expenses: 0 });

        const months = monthlyTrendData.length;
        return {
            avgIncome: sum.income / months,
            avgExpenses: sum.expenses / months,
            avgSavings: (sum.income - sum.expenses) / months
        };
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadStatsData(currentPeriodDates, previousPeriodDates);
        setRefreshing(false);
    };

    const renderTabContent = () => {
        const monthlyAverages = calculateMonthlyAverages(monthlyTrend);
        
        switch (selectedTab) {
            case 0: // Summary
                return (
                    <>
                        <SummaryCard 
                            data={{
                                ...summary,
                                monthlyAverages
                            }} 
                        />
                        <MonthlyTrendCard data={monthlyTrend} />
                    </>
                );
            case 1: // Compare
                return (
                    <>
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
            case 3: // Top
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
                    </>
                );
            default:
                return null;
        }
    };

    const tabs = ['Summary', 'Compare', 'Pie Chart', 'Ranking'];

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>  
                    <View style={styles.chipsContainer}>
                        <ExportButton 
                            data={{
                                summary,
                                periodComparison,
                                expenseCategories,
                                incomeCategories,
                                monthlyTrend,
                                dateRange: currentPeriodDates,
                                previousDateRange: previousPeriodDates,
                                metrics
                            }}
                        />
                        <PeriodSelector
                            selectedPeriod={selectedPeriod}
                            onSelectPeriod={(period) => setSelectedPeriod(period)}
                        />
                    </View>
                    <TabBar
                        tabs={tabs}
                        activeTab={selectedTab}
                        onTabPress={setSelectedTab}
                    />
                    <ScrollView
                        style={styles.scrollView}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }>
                        {renderTabContent()}
                        <View style={styles.footer} />
                    </ScrollView>
                </>
            )}
        </View>
    );
}