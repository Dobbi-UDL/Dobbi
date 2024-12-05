import { supabase } from '../config/supabaseClient';

export async function fetchFinancialSummary(userId, startDate, endDate) {
    const { data, error } = await supabase
        .rpc('get_financial_summary', {
            user_id: userId,
            start_date: startDate,
            end_date: endDate
        });

    if (error) {
        console.error('Error fetching financial summary:', error);
        return null;
    }
    
    const summaryRow = data[0];
    const totalIncome = summaryRow.total_income;
    const totalExpenses = summaryRow.total_expenses;
    const savings = totalIncome - totalExpenses;
    const savingsRate = savings > 0 ? ((savings / totalIncome) * 100).toFixed(2) : 0;

    return { totalIncome, totalExpenses, savings, savingsRate };
}

export async function fetchPeriodComparison(userId, currentStartDate, currentEndDate, previousStartDate, previousEndDate){
    const { data, error } = await supabase
        .rpc('get_period_comparison', {
            p_user_id: userId,
            current_start_date: currentStartDate,
            current_end_date: currentEndDate,
            previous_start_date: previousStartDate,
            previous_end_date: previousEndDate
        });

    if (error) {
        console.error('Error fetching period comparison:', error);
        return null;
    }

    return data;
}

export async function fetchCategoryDistribution(userId, startDate, endDate){
    // Fetch category distribution data
    const { data, error } = await supabase
        .rpc('get_category_distribution', {
            p_user_id: userId,
            p_start_date: startDate,
            p_end_date: endDate
        });

    if (error) {
        console.error('Error fetching category distribution:', error);
        throw error;
    }

    // Fetch category count for each type
    const { data: countData, error: countError } = await supabase
        .rpc('get_income_expense_counts', {
            p_user_id: userId,
            p_start_date: startDate,
            p_end_date: endDate
        });

    if (countError) {
        console.error('Error fetching category counts:', countError);
        throw error;
    }

    // Split data into income and expense categories, based on count of each type
    const expenseCount = countData[0].expense_count;

    const expenseData = data.slice(0, expenseCount);
    const incomeData = data.slice(expenseCount);

    return { expenseData, incomeData };
}

export async function fetchMonthlyIncomeExpensesTrend(userId, startDate, endDate){
    const { data, error } = await supabase
        .rpc('get_income_expenses_trend', {
            p_user_id: userId,
            p_start_date: startDate,
            p_end_date: endDate
        });

    if (error) {
        console.error('Error fetching monthly income vs expenses trend:', error);
        throw error;
    }

    return data;
}