import { supabase } from '../config/supabaseClient';

export async function fetchFinancialSummary(userId, startDate, endDate) {
    console.log('Fetching financial summary...');
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
    console.log('Fetching period comparison...');
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