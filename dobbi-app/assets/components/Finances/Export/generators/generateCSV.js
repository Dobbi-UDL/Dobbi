import * as FileSystem from 'expo-file-system';

export const generateCSV = async (data) => {
    try {
        // Validate input data
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data provided to CSV generator');
        }

        const {
            summary,
            periodComparison,
            expenseCategories,
            incomeCategories,
            monthlyTrend,
            dateRange
        } = data;

        // Validate required data properties
        if (!summary || !periodComparison || !expenseCategories || !incomeCategories || !monthlyTrend) {
            console.error('Missing required data:', { summary, periodComparison, expenseCategories, incomeCategories, monthlyTrend });
            throw new Error('Missing required data for CSV generation');
        }

        let csvContent = '';

        // Report metadata
        csvContent += `Financial Report,${dateRange?.startDate} to ${dateRange?.endDate}\n`;
        csvContent += `Generated on,${new Date().toLocaleDateString()}\n\n`;

        // Financial Summary
        csvContent += 'FINANCIAL SUMMARY\n';
        csvContent += 'Metric,Value\n';
        csvContent += `Total Income,${summary.totalIncome}\n`;
        csvContent += `Total Expenses,${summary.totalExpenses}\n`;
        csvContent += `Net Savings,${summary.savings}\n`;
        csvContent += `Savings Rate,${summary.savingsRate}%\n\n`;

        // Expense Categories
        csvContent += 'EXPENSE CATEGORIES\n';
        csvContent += 'Category,Amount,Percentage\n';
        expenseCategories.forEach(cat => {
            csvContent += `${cat.category_name},${cat.total_amount},${cat.percentage}%\n`;
        });
        csvContent += '\n';

        // Income Categories
        csvContent += 'INCOME CATEGORIES\n';
        csvContent += 'Category,Amount,Percentage\n';
        incomeCategories.forEach(cat => {
            csvContent += `${cat.category_name},${cat.total_amount},${cat.percentage}%\n`;
        });
        csvContent += '\n';

        // Period Comparison
        csvContent += 'PERIOD COMPARISON\n';
        csvContent += 'Category,Current Period,Previous Period,Change %\n';
        periodComparison.forEach(item => {
            const change = item.previous_period_expense === 0 ? 'N/A' :
                ((item.current_period_expense - item.previous_period_expense) / 
                item.previous_period_expense * 100).toFixed(2) + '%';
            csvContent += `${item.category_name},${item.current_period_expense},${item.previous_period_expense},${change}\n`;
        });
        csvContent += '\n';

        // Monthly Trend
        csvContent += 'MONTHLY TREND\n';
        csvContent += 'Month,Income,Expenses,Net\n';
        monthlyTrend.forEach(month => {
            const net = month.total_income - month.total_expenses;
            csvContent += `${month.month_year},${month.total_income},${month.total_expenses},${net}\n`;
        });
        csvContent += '\n';

        // Create temporary file
        console.log('Generating CSV file...');
        const tempUri = FileSystem.documentDirectory + 'temp.csv';
        await FileSystem.writeAsStringAsync(tempUri, csvContent);
        console.log('CSV generated successfully at:', tempUri);

        return tempUri;
    } catch (error) {
        console.error('CSV generation error:', error);
        throw new Error(`CSV generation failed: ${error.message}`);
    }
};