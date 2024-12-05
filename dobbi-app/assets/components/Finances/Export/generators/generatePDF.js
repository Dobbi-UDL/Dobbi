import * as Print from 'expo-print';

export const generatePDF = async (data) => {
    try {
        // Validate input data
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data provided to PDF generator');
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
            throw new Error('Missing required data for PDF generation');
        }

        // Helper functions
        const formatCurrency = (amount) => `$${Number(amount).toFixed(2)}`;
        const formatPercentage = (value) => `${Number(value).toFixed(2)}%`;

        const generateCategoryRows = (categories) => categories.map(cat => `
            <tr>
                <td>${cat.category_name}</td>
                <td>${formatCurrency(cat.total_amount)}</td>
                <td>${formatPercentage(cat.percentage)}</td>
            </tr>
        `).join('');

        const generateComparisonRows = (data) => data.map(item => `
            <tr>
                <td>${item.category_name}</td>
                <td>${formatCurrency(item.current_period_expense)}</td>
                <td>${formatCurrency(item.previous_period_expense)}</td>
                <td>${item.previous_period_expense === 0 ? 'N/A' : 
                    formatPercentage(((item.current_period_expense - item.previous_period_expense) / 
                    item.previous_period_expense) * 100)}</td>
            </tr>
        `).join('');

        const generateTrendRows = (data) => data.map(month => `
            <tr>
                <td>${month.month_year}</td>
                <td>${formatCurrency(month.total_income)}</td>
                <td>${formatCurrency(month.total_expenses)}</td>
                <td>${formatCurrency(month.total_income - month.total_expenses)}</td>
            </tr>
        `).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .logo { color: #EE6567; font-size: 24px; font-weight: bold; }
                    .title { margin: 20px 0; color: #333; }
                    .section { margin: 20px 0; }
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f8f8f8; }
                    .footer { margin-top: 40px; text-align: center; color: #666; }
                    .highlight { color: #EE6567; font-weight: bold; }
                    .metric-group { 
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin: 15px 0;
                    }
                    .metric-card {
                        background: #f8f8f8;
                        padding: 15px;
                        border-radius: 8px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">Dobbi</div>
                    <h1>Financial Statistics Report</h1>
                    <p>Period: ${dateRange?.startDate} to ${dateRange?.endDate}</p>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                </div>

                <div class="section">
                    <h2>Financial Overview</h2>
                    <div class="metric-group">
                        <div class="metric-card">
                            <h3>Income & Expenses</h3>
                            <table>
                                <tr><th>Total Income</th><td>${formatCurrency(summary.totalIncome)}</td></tr>
                                <tr><th>Total Expenses</th><td>${formatCurrency(summary.totalExpenses)}</td></tr>
                                <tr><th>Net Savings</th><td>${formatCurrency(summary.savings)}</td></tr>
                                <tr><th>Savings Rate</th><td>${formatPercentage(summary.savingsRate)}</td></tr>
                            </table>
                        </div>
                        <div class="metric-card">
                            <h3>Key Metrics</h3>
                            <table>
                                <tr>
                                    <th>Average Monthly Income</th>
                                    <td>${formatCurrency(monthlyTrend.reduce((acc, curr) => 
                                        acc + curr.total_income, 0) / monthlyTrend.length)}</td>
                                </tr>
                                <tr>
                                    <th>Average Monthly Expenses</th>
                                    <td>${formatCurrency(monthlyTrend.reduce((acc, curr) => 
                                        acc + curr.total_expenses, 0) / monthlyTrend.length)}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>Category Analysis</h2>
                    <h3>Expense Categories</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>${generateCategoryRows(expenseCategories)}</tbody>
                    </table>

                    <h3>Income Categories</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Percentage</th>
                            </tr>
                        </thead>
                        <tbody>${generateCategoryRows(incomeCategories)}</tbody>
                    </table>
                </div>

                <div class="section">
                    <h2>Period Comparison</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Current Period</th>
                                <th>Previous Period</th>
                                <th>Change %</th>
                            </tr>
                        </thead>
                        <tbody>${generateComparisonRows(periodComparison)}</tbody>
                    </table>
                </div>

                <div class="section">
                    <h2>Monthly Trend</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Income</th>
                                <th>Expenses</th>
                                <th>Net</th>
                            </tr>
                        </thead>
                        <tbody>${generateTrendRows(monthlyTrend)}</tbody>
                    </table>
                </div>

                <div class="footer">
                    <p>Report generated by Dobbi Financial Analytics</p>
                </div>
            </body>
            </html>
        `;

        // Print to file
        console.log('Generating PDF file...');
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false,
        });
        console.log('PDF generated successfully at:', uri);

        return uri;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error(`PDF generation failed: ${error.message}`);
    }
};