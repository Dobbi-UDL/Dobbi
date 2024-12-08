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
            if (amount === undefined || amount === null) return '$0.00';
            return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        };

        // Calculate spending change percentage with better explanation
        const getSpendingChangeInfo = () => {
            if (!periodComparison || !periodComparison.length) return { text: 'No change' };
            const currentTotal = periodComparison.reduce((sum, item) => sum + item.current_period_expense, 0);
            const previousTotal = periodComparison.reduce((sum, item) => sum + item.previous_period_expense, 0);
            
            if (previousTotal === 0) return { text: 'No previous data for comparison' };
            
            const change = ((currentTotal - previousTotal) / previousTotal * 100).toFixed(2);
            return { 
                text: change > 0 
                    ? `Spending <strong>increased by ${change}%</strong> compared to previous period`
                    : `Spending <strong>decreased by ${Math.abs(change)}%</strong> compared to previous period`
            };
        };

        // Get monthly trend info or message
        const getMonthlyTrendInfo = () => {
            const startDate = new Date(dateRange.startDate);
            const endDate = new Date(dateRange.endDate);
            const monthsDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 
                           + endDate.getMonth() - startDate.getMonth();

            return {
                isSingleMonth: monthsDiff < 1,
                message: "Monthly analysis not available for periods less than one month.",
                averages: {
                    income: metrics?.income?.average || 0,
                    expenses: metrics?.expenses?.average || 0,
                    savings: metrics?.savings?.average || 0
                }
            };
        };

        const getSavingsStatus = (savingsRate) => {
            const rate = parseFloat(savingsRate);
            if (rate >= 20) {
                return {
                    class: 'status-excellent',
                    text: 'Excellent Performance',
                    message: 'Your savings rate is considered excellent as it exceeds the recommended 20% threshold for long-term financial security.',
                    advice: 'Continue maintaining this savings discipline to build a strong emergency fund and meet your long-term financial goals.',
                    color: '#2da77a'
                };
            } else if (rate >= 10) {
                return {
                    class: 'status-good',
                    text: 'Good Performance',
                    message: 'Your savings rate is good, showing a solid foundation for financial stability.',
                    advice: 'Consider identifying areas where you could increase savings to reach the excellent threshold of 20%.',
                    color: '#ff9800'
                };
            } else if (rate > 0) {
                return {
                    class: 'status-fair',
                    text: 'Fair Performance',
                    message: 'Your savings rate shows you\'re making an effort to save, but there\'s room for improvement.',
                    advice: 'Review your expenses to find opportunities for increasing your savings rate to at least 10%.',
                    color: '#f44336'
                };
            } else {
                return {
                    class: 'status-needs-attention',
                    text: 'Needs Attention',
                    message: 'Your current savings rate indicates potential financial stress.',
                    advice: 'Consider creating a budget and identifying non-essential expenses that could be reduced to start building savings.',
                    color: '#d32f2f'
                };
            }
        };

        const spendingChange = getSpendingChangeInfo();
        const monthlyTrendInfo = getMonthlyTrendInfo();
        const savingsStatus = getSavingsStatus(summary.savingsRate);

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
                        width: 100%;
                    }
                    .section > * {
                        max-width: 100%;
                    }
                    .executive-summary,
                    .analysis-box,
                    .metric-grid {
                        width: 100%;
                        box-sizing: border-box;
                    }
                    .summary-intro {
                        width: 100%;
                        box-sizing: border-box;
                        padding: 0;
                        margin-bottom: 25px;
                    }
                    .subsection {
                        margin-top: 30px;
                        width: 100%;
                        padding: 0;
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
                    .highlight {
                        color: #EE6567;
                        font-weight: 500;
                    }
                    .subsection {
                        margin-top: 30px;
                    }
                    .subsection-title {
                        font-size: 18px;
                        color: #444;
                        margin-bottom: 15px;
                        font-weight: 600;
                    }
                    .metric-grid {
                        display: grid;
                        grid-template-columns: repeat(2, 1fr);
                        gap: 20px;
                        margin: 20px 0;
                    }
                    .metric-card {
                        background: #f9f9f9;
                        padding: 15px;
                        border-radius: 6px;
                    }
                    .metric-label {
                        font-size: 14px;
                        color: #666;
                        margin-bottom: 5px;
                    }
                    .metric-value {
                        font-size: 24px;
                        color: #333;
                        font-weight: 600;
                    }
                    .analysis-box {
                        background: #fff;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 15px 0;
                    }
                    .analysis-summary {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                        margin-bottom: 15px;
                    }
                    .rating-indicator {
                        flex-shrink: 0;
                        text-align: center;
                    }
                    .rating-value {
                        font-size: 32px;
                        font-weight: 600;
                        color: #2da77a;
                        margin-bottom: 5px;
                    }
                    .rating-label {
                        font-size: 14px;
                        color: #666;
                    }
                    .savings-status {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-weight: 500;
                        margin-bottom: 10px;
                    }
                    .status-excellent {
                        background: #e3f6e5;
                        color: #2da77a;
                    }
                    .status-good {
                        background: #fff4e5;
                        color: #ff9800;
                    }
                    .status-fair {
                        background: #ffeeee;
                        color: #f44336;
                    }
                    .status-needs-attention {
                        background: #ffd7d5;
                        color: #d32f2f;
                    }
                    .savings-ranges {
                        background: #f9f9f9;
                        padding: 12px;
                        border-radius: 6px;
                        margin: 15px 0;
                    }
                    .savings-ranges p {
                        margin: 5px 0;
                        font-size: 14px;
                    }
                    .analysis-box p {
                        text-align: justify;
                        margin-bottom: 15px;
                        line-height: 1.6;
                    }
                    .page-break {
                        page-break-before: always;
                        height: 0;
                        margin: 0;
                        padding: 0;
                    }
                    
                    .page-break + .section {
                        margin-top: 50px;
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
                        <!-- Quick Overview Section (formerly Executive Summary) -->
                        <div class="section">
                            <h2 class="section-title">Quick Overview</h2>
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
                                                <li>Previous Period: ${previousDateRange?.startDate} to ${previousDateRange?.endDate}</li>
                                                <li>${spendingChange.text}</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="insight-card">
                                        <div class="insight-title">Categories</div>
                                        <div class="insight-value">
                                            <ul>
                                                <li>Top Expenses:
                                                    ${expenseCategories.length >= 2 
                                                        ? `<br>
                                                           1. <strong>${expenseCategories[0].category_name} (${expenseCategories[0].percentage.toFixed(2)}%)</strong><br>
                                                           2. <strong>${expenseCategories[1].category_name} (${expenseCategories[1].percentage.toFixed(2)}%)</strong>`
                                                        : expenseCategories.length === 1
                                                            ? `<br>1. <strong>${expenseCategories[0].category_name} (${expenseCategories[0].percentage.toFixed(2)}%)</strong>`
                                                            : 'This period has no expense data'
                                                    }
                                                </li>
                                                <li>Top Income:
                                                    ${incomeCategories.length >= 2 
                                                        ? `<br>
                                                           1. <strong>${incomeCategories[0].category_name} (${incomeCategories[0].percentage.toFixed(2)}%)</strong><br>
                                                           2. <strong>${incomeCategories[1].category_name} (${incomeCategories[1].percentage.toFixed(2)}%)</strong>`
                                                        : incomeCategories.length === 1
                                                            ? `<br>1. <strong>${incomeCategories[0].category_name} (${incomeCategories[0].percentage.toFixed(2)}%)</strong>`
                                                            : 'This period has no income data'
                                                    }
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div class="insight-card">
                                        <div class="insight-title">Monthly Trend</div>
                                        <div class="insight-value">
                                            ${monthlyTrendInfo.isSingleMonth 
                                                ? `<p>${monthlyTrendInfo.message}</p>`
                                                : `<ul>
                                                    <li>Average Monthly Income: <strong>${formatCurrency(monthlyTrendInfo.averages.income)}</strong></li>
                                                    <li>Average Monthly Expenses: <strong>${formatCurrency(monthlyTrendInfo.averages.expenses)}</strong></li>
                                                    <li>Average Monthly Savings: <strong>${formatCurrency(monthlyTrendInfo.averages.savings)}</strong></li>
                                                </ul>`
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="page-break"></div>

                        <!-- Financial Overview section -->
                        <div class="section">
                            <h2 class="section-title">Financial Overview</h2>
                            <p class="summary-intro">
                                Examine your core financial metrics and savings performance. This analysis reveals your income utilization, spending efficiency, and how effectively you're building long-term wealth through savings.
                            </p>

                            <div class="subsection">
                                <h3 class="subsection-title">Key Numbers</h3>
                                <div class="metric-grid">
                                    <div class="metric-card">
                                        <div class="metric-label">Total Income</div>
                                        <div class="metric-value">${formatCurrency(summary.totalIncome)}</div>
                                    </div>
                                    <div class="metric-card">
                                        <div class="metric-label">Total Expenses</div>
                                        <div class="metric-value">${formatCurrency(summary.totalExpenses)}</div>
                                    </div>
                                    <div class="metric-card">
                                        <div class="metric-label">Net Savings</div>
                                        <div class="metric-value">${formatCurrency(summary.savings)}</div>
                                    </div>
                                    <div class="metric-card">
                                        <div class="metric-label">Savings Rate</div>
                                        <div class="metric-value">${summary.savingsRate}%</div>
                                    </div>
                                </div>
                            </div>

                            <div class="subsection">
                                <h3 class="subsection-title">Savings Analysis</h3>
                                <div class="analysis-box">
                                    <div class="analysis-summary">
                                        <div class="rating-indicator">
                                            <div class="rating-value" style="color: ${savingsStatus.color}">${summary.savingsRate}%</div>
                                            <div class="rating-label">Savings Rate</div>
                                        </div>
                                        <div class="savings-status ${savingsStatus.class}">${savingsStatus.text}</div>
                                    </div>
                    
                                    <p style="margin: 15px 0;">
                                        ${savingsStatus.message}
                                    </p>
                                    <p style="margin-bottom: 20px;">
                                        ${savingsStatus.advice}
                                    </p>

                                    <div class="savings-ranges">
                                        <p style="margin-bottom: 15px;"><strong>Understanding Your Savings Rate</strong></p>
                                        <p style="margin-bottom: 10px;">The savings rate is calculated as the percentage of income saved after expenses, and is sorted into 4 categories:</p>
                                        <p>• <span style="color: #2da77a">Excellent (>= 20%)</span> - Strong financial health and long-term security</p>
                                        <p>• <span style="color: #ff9800">Good (10% - 20%)</span> - Solid foundation for financial stability</p>
                                        <p>• <span style="color: #f44336">Fair (> 0% - 10%)</span> - Room for improvement in savings habits</p>
                                        <p>• <span style="color: #d32f2f">Needs Attention (0%)</span> - Immediate action recommended</p>
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