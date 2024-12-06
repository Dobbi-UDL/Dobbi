import * as Print from 'expo-print';
import { DOBBI_LOGO_BASE64 } from '../../../../images/dobbiLogo';
import { DOBBI_BRAND_BASE64 } from '../../../../images/dobbiBrand';
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
            dateRange,
            previousDateRange,
            metrics
        } = data;

        // Validate required data properties
        if (!summary || !periodComparison || !expenseCategories || !incomeCategories || !monthlyTrend || !dateRange || !previousDateRange || !metrics) {
            console.error('Missing required data:', { summary, periodComparison, expenseCategories, incomeCategories, monthlyTrend, monthlyAverages });
            throw new Error('Missing required data for PDF generation');
        }

        // Use the imported base64 logo and brand directly
        const dobbiLogo = DOBBI_LOGO_BASE64;
        const dobbiBrand = DOBBI_BRAND_BASE64;

        const formatCurrency = (amount) => {
            // Add safety check for undefined or null values
            if (amount === undefined || amount === null) return '$0.00';
            return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        };

        // Add safety checks for data access
        const topExpense = expenseCategories && expenseCategories[0] ? {
            name: expenseCategories[0].category_name || 'No category',
            total: expenseCategories[0].total || 0
        } : { name: 'No data', total: 0 };

        const topIncome = incomeCategories && incomeCategories[0] ? {
            name: incomeCategories[0].category_name || 'No category',
            total: incomeCategories[0].total || 0
        } : { name: 'No data', total: 0 };

        // Calculate spending change percentage
        const calculateSpendingChange = () => {
            if (!periodComparison || !periodComparison.length) return 0;
            const currentTotal = periodComparison.reduce((sum, item) => sum + item.current_period_expense, 0);
            const previousTotal = periodComparison.reduce((sum, item) => sum + item.previous_period_expense, 0);
            if (previousTotal === 0) return 0;
            return ((currentTotal - previousTotal) / previousTotal * 100).toFixed(1);
        };

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    @page {
                        margin: 0;
                        size: A4;
                    }
                    body {
                        font-family: 'Helvetica', sans-serif;
                        margin: 0;
                        padding: 0;
                        background: #fff;
                    }
                    .page {
                        width: 210mm;
                        height: 297mm;
                        page-break-after: always;
                    }
                    .header {
                        background: #fafafa;
                        padding: 40px 50px;
                        border-bottom: 3px solid #eee;
                    }
                    .header-content {
                        max-width: 1000px;
                        margin: 0 auto;
                    }
                    .logo-section {
                        display: flex;
                        align-items: center;
                    }
                    .logo {
                        width: 140px;
                        height: auto;
                        margin-right: 40px;
                    }
                    .header-right {
                        display: flex;
                        flex-direction: column;
                        gap: 10px;
                    }
                    .brand-name {
                        width: 160px;
                        height: auto;
                    }
                    .report-title {
                        font-size: 32px;
                        color: #333;
                        margin: 10px 0 0 0;
                    }
                    .report-subtitle {
                        font-size: 16px;
                        color: #666;
                        margin: 0;
                    }
                    .meta-info {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 20px;
                        padding-top: 20px;
                        border-top: 1px solid #eee;
                    }
                    .period {
                        font-size: 14px;
                        color: #666;
                    }
                    .generation-date {
                        font-size: 14px;
                        color: #888;
                    }
                    .content {
                        padding: 40px 50px;
                        max-width: 1000px;
                        margin: 0 auto;
                    }
                    .section {
                        margin-bottom: 40px;
                    }
                    .section-title {
                        font-size: 24px;
                        color: #EE6567;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #f0f0f0;
                    }
                    .executive-summary {
                        background: #fff;
                        margin: 20px 0 40px;
                    }
                    .summary-intro {
                        color: #333;
                        font-size: 16px;
                        line-height: 1.6;
                        margin-bottom: 25px;
                    }
                    .key-insights {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin-top: 20px;
                    }
                    .insight-card {
                        background: #f9f9f9;
                        border-left: 5px solid #EE6567;
                        padding: 20px;
                        border-radius: 6px;
                        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s;
                    }
                    .insight-card:hover {
                        transform: translateY(-5px);
                    }
                    .insight-title {
                        color: black;
                        font-size: 18px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .insight-value {
                        color: #555;
                        font-size: 16px;
                        line-height: 1.6;
                    }
                    .insight-value ul {
                        list-style-type: disc;
                        margin-left: 20px;
                    }
                    
                </style>
            </head>
            <body>
                <div class="page">
                    <!-- Header Section -->
                    <div class="header">
                        <div class="header-content">
                            <div class="logo-section">
                                <img src="${dobbiLogo}" alt="Dobbi Logo" class="logo">
                                <div class="header-right">
                                    <img src="${dobbiBrand}" alt="Dobbi Brand" class="brand-name">
                                    <h1 class="report-title">Financial Statistics Report</h1>
                                    <div class="report-subtitle">Comprehensive Financial Analysis</div>
                                </div>
                            </div>
                            <div class="meta-info">
                                <div class="period">Report Period: ${dateRange?.startDate} to ${dateRange?.endDate}</div>
                                <div class="generation-date">Generated on ${new Date().toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Content Section -->
                    <div class="content">
                        <!-- Executive Summary Section -->
                        <div class="section">
                            <h2 class="section-title">Executive Summary</h2>
                            <div class="executive-summary">
                                <p class="summary-intro">
                                    Here's a quick overview of your financial performance for the period 
                                    <span class="highlight">${dateRange?.startDate}</span> to 
                                    <span class="highlight">${dateRange?.endDate}</span>. 
                                    This summary highlights key insights from your financial activities.
                                </p>

                                <div class="key-insights">
                                    <div class="insight-card">
                                        <div class="insight-title">Overview</div>
                                        <div class="insight-value">
                                            <ul>
                                                <li>Total Income: <strong>${formatCurrency(summary?.totalIncome || 0)}</strong></li>
                                                <li>Total Expenses: <strong>${formatCurrency(summary?.totalExpenses || 0)}</strong></li>
                                                <li>Net Savings: <strong>${formatCurrency(summary?.savings || 0)} (${summary?.savingsRate || 0}%)</strong></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="insight-card">
                                        <div class="insight-title">Period Comparison</div>
                                        <div class="insight-value">
                                            <ul>
                                                <li>Previous Period: <strong>${previousDateRange?.startDate} to ${previousDateRange?.endDate}</strong></li>
                                                <li>Spending Change: <strong>${calculateSpendingChange()}%</strong></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="insight-card">
                                        <div class="insight-title">Categories</div>
                                        <div class="insight-value">
                                            <ul>
                                                <li>Top Spending: <strong>${topExpense.name} (${formatCurrency(topExpense.total)})</strong></li>
                                                <li>Top Income: <strong>${topIncome.name} (${formatCurrency(topIncome.total)})</strong></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="insight-card">
                                        <div class="insight-title">Monthly Trend</div>
                                        <div class="insight-value">
                                            <ul>
                                                <li>Average Income: <strong>${formatCurrency(metrics?.income?.average || 0)}</strong></li>
                                                <li>Average Expenses: <strong>${formatCurrency(metrics?.expenses?.average || 0)}</strong></li>
                                                <li>Average Savings: <strong>${formatCurrency(metrics?.savings?.average || 0)}</strong></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Rest of the sections will follow -->
                        <div class="section">
                            <h2 class="section-title">Dummy title</h2>
                        </div>
                    </div>
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