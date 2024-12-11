import * as Print from 'expo-print';
import { DOBBI_LOGO_BASE64 } from '../../../../images/dobbiLogo';
import { DOBBI_BRAND_BASE64 } from '../../../../images/dobbiBrand';
import { formatCurrency, formatPercentage } from '../../../../../utils/numberHelpers';

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

        // Remove the old formatCurrency function since we're now importing it

        // Calculate spending change percentage with better explanation
        const getSpendingChangeInfo = () => {
            if (!periodComparison || !periodComparison.length) return { text: 'No change' };
            const currentTotal = periodComparison.reduce((sum, item) => sum + item.current_period_expense, 0);
            const previousTotal = periodComparison.reduce((sum, item) => sum + item.previous_period_expense, 0);

            if (previousTotal === 0) return { text: 'No previous data for comparison' };

            const change = ((currentTotal - previousTotal) / previousTotal * 100);
            return {
                text: change > 0
                    ? `Spending <strong>increased by ${formatPercentage(change, { showSign: true })}</strong>`
                    : `Spending <strong>decreased by ${formatPercentage(Math.abs(change))}</strong>`
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

        const footerContent = `
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Dobbi Financial Analytics. All rights reserved.</p>
            </div>
        `;

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    @page {
                        margin-top: 20mm;
                        margin-bottom: 15mm;
                        margin-left: 20mm;
                        margin-right: 20mm;
                        size: A4;
                        @bottom-center {
                            content: "© ${new Date().getFullYear()} Dobbi Financial Analytics. All rights reserved.";
                            font-size: 10pt;
                            color: #666;
                            padding-top: 10px;
                        }
                    }
                    @page :first {
                        margin-top: 0mm;
                        margin-bottom: 25mm;
                        margin-left: 0mm;
                        margin-right: 0mm;
                    }
                    body {
                        font-family: 'Helvetica', sans-serif;
                        margin: 0;
                        padding: 0;
                        background: #fff;
                    }
                    .report-page {
                        break-before: page;
                        margin-bottom: -40mm;
                    }
                    @media print {
                        .avoid-break {
                            break-inside: avoid;
                        }
                    }
                    .header {
                        background: #fafafa;
                        padding: 40px 20px;
                        border-bottom: 3px solid #eee;
                        padding-bottom: 20px;
                    }
                    
                    .header-content {
                        max-width: 1000px;
                        margin: 0 auto;
                        padding: 0 50px; /* Move horizontal padding to header-content */
                    }
                    .first-page-content {
                        padding-top: 0;      /* Remove extra padding for first page */
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
                        padding: 20px 50px; /* Reduced from 40px top padding */
                        max-width: 1000px;
                        margin: 0 auto;
                        background: #fff;
                        position: relative;
                        z-index: 2;
                    }
                    .section-first-page {
                        margin-right: 20mm;
                        margin-left: 20mm;
                        padding-top: 40px; /* Add extra padding between header and content */
                    }
                    .section {
                        width: 100%;
                        background: #fff;
                        position: relative;
                        z-index: 2;
                        padding-bottom: 0;
                        min-height: 100%;
                    }
                    .section > * {
                        max-width: 100%;
                    }
                    .executive-summary,
                    .analysis-box,
                    .analysis-box-1,
                    .metric-grid {
                        width: 100%;
                        box-sizing: border-box;
                        position: relative;
                        z-index: 2;
                        background: #fff;
                    }
                    .summary-intro {
                        width: 100%;
                        box-sizing: border-box;
                        padding: 0;
                        margin-bottom: 25px;
                    }
                    .subsection {
                        margin-top: 20px; /* Reduced from 30px */
                        width: 100%;
                        padding: 0;
                    }
                    .section-title {
                        font-size: 24px;
                        color: #EE6567;
                        margin-bottom: 20px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #f0f0f0;
                        margin-top: -4px;
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
                        position: relative;
                        z-index: 200;
                    }
                    .analysis-box-1 {
                        background: #fff;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        padding-top: 20px;
                        padding-right: 20px;
                        padding-bottom: 5px;
                        padding-left: 20px;
                        margin: 15px 0;
                        position: relative;
                        z-index: 200;
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
                    .analysis-box-1 p {
                        text-align: justify;
                        margin-bottom: 12px;
                        line-height: 1.4;
                    }
                    .page-break {
                        page-break-before: always;
                        height: 0;
                        margin-top: 50px;
                        padding: 0;
                    }
                    
                    .page-break + .section {
                        margin-top: 50px;
                    }

                    /* Monthly Trends styles */
                    .trend-graph {
                        width: 100%;
                        height: 300px;
                        margin: 20px 0;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        padding: 20px;
                    }

                    .monthly-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin: 20px 0;
                        position: relative;
                        z-index: 2;
                        background: #fff;
                    }

                    .monthly-table th,
                    .monthly-table td {
                        padding: 12px;
                        text-align: right;
                        border-bottom: 1px solid #eee;
                    }

                    .monthly-table th {
                        background: #f9f9f9;
                        font-weight: 600;
                        color: #444;
                        text-align: left;
                    }

                    .monthly-table th:not(:first-child) {
                        text-align: right;
                    }

                    .stats-container {
                        margin: 0;
                        position: relative;
                        z-index: 2;
                        background: #fff;
                    }

                    .stats-row {
                        padding: 25px 0;
                        border-bottom: 1px solid #eee;
                        background: #fff;
                    }

                    .stats-row:first-child {
                        padding-top: 0;
                    }

                    .stats-row:last-child {
                        border-bottom: none;
                    }

                    .stats-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                    }

                    .stats-header h4 {
                        font-size: 18px;
                        color: #444;
                        margin: 0;
                        font-weight: 600;
                    }

                    .monthly-average {
                        text-align: right;
                    }

                    .monthly-average .value {
                        display: block;
                        font-size: 24px;
                        font-weight: 600;
                        color: #333;
                    }

                    .monthly-average .label {
                        font-size: 12px;
                        color: #666;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .stats-details {
                        display: flex;
                        gap: 40px;
                        margin-left: 20px;
                        background: #f9f9f9;
                        padding: 15px;
                        border-radius: 6px;
                    }

                    .stat-group {
                        display: flex;
                        gap: 30px;
                    }

                    .stat-item {
                        display: flex;
                        flex-direction: column;
                        min-width: 100px;
                    }

                    .stat-item .label {
                        font-size: 12px;
                        color: #666;
                        margin-bottom: 4px;
                    }

                    .stat-item .value {
                        font-size: 16px;
                        color: #333;
                        font-weight: 500;
                    }

                    .category-section {
                        background: #fff;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        padding: 25px;
                        margin: 20px 0;
                        position: relative;
                        z-index: 2;
                        background: #fff;
                    }
                    
                    .category-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 20px;
                        padding-bottom: 15px;
                        border-bottom: 2px solid #f0f0f0;
                    }
                    
                    .category-title {
                        font-size: 18px;
                        color: #444;
                        font-weight: 600;
                        margin: 0;
                    }
                    
                    .category-total {
                        text-align: right;
                    }
                    
                    .category-total .amount {
                        font-size: 24px;
                        font-weight: 600;
                        color: #333;
                        display: block;
                    }
                    
                    .category-total .label {
                        font-size: 12px;
                        color: #666;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    
                    .category-list {
                        display: grid;
                        gap: 15px;
                    }
                    
                    .category-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 15px;
                        background: #f9f9f9;
                        border-radius: 6px;
                        border-left: 3px solid #EE6567;
                    }
                    
                    .category-item.income {
                        border-left-color: #2da77a;
                    }
                    
                    .category-item.expense {
                        border-left-color: #EE6567;
                    }
                    
                    .category-info {
                        display: flex;
                        align-items: center;
                        gap: 15px;
                    }
                    
                    .category-name {
                        font-weight: 500;
                        color: #333;
                    }
                    
                    .category-metrics {
                        text-align: right;
                    }
                    
                    .category-amount {
                        font-size: 16px;
                        font-weight: 600;
                        color: #333;
                        margin-bottom: 4px;
                    }
                    
                    .category-percentage {
                        font-size: 14px;
                        color: #666;
                    }
                    .monthly-table th:nth-child(1) {
                        width: 50%;
                        text-align: left;
                    }
                    .monthly-table th:nth-child(2) {
                        width: 25%;
                        text-align: right;
                    }
                    .monthly-table th:nth-child(3) {
                        width: 25%;
                        text-align: right;
                    }
                    .footer {
                        text-align: center;
                        color: #888;
                        font-size: 12px;
                        padding: 10px;
                        position: fixed;
                        bottom: 0;
                        width: 100%;
                        z-index: 1;
                    }
                </style>
            </head>
            <body>
                <!-- First Page: Header + Quick Overview -->
                <div class="report-page">
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

                    <!-- Quick Overview as a normal section -->
                    <section class="section-first-page">
                        <h2 class="section-title">Quick Overview</h2>
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
                                                <li>Net Savings: <strong>${formatCurrency(summary?.savings || 0)} (${formatPercentage(summary?.savingsRate || 0)})</strong></li>
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
                                                           1. <strong>${expenseCategories[0].category_name} (${formatPercentage(expenseCategories[0].percentage.toFixed(2))})</strong><br>
                                                           2. <strong>${expenseCategories[1].category_name} (${formatPercentage(expenseCategories[1].percentage.toFixed(2))})</strong>`
                : expenseCategories.length === 1
                    ? `<br>1. <strong>${expenseCategories[0].category_name} (${formatPercentage(expenseCategories[0].percentage.toFixed(2))})</strong>`
                    : 'This period has no expense data'
            }
                                                </li>
                                                <li>Top Income:
                                                    ${incomeCategories.length >= 2
                ? `<br>
                                                           1. <strong>${incomeCategories[0].category_name} (${formatPercentage(incomeCategories[0].percentage.toFixed(2))})}</strong><br>
                                                           2. <strong>${incomeCategories[1].category_name} (${formatPercentage(incomeCategories[1].percentage.toFixed(2))})}</strong>`
                : incomeCategories.length === 1
                    ? `<br>1. <strong>${incomeCategories[0].category_name} (${formatPercentage(incomeCategories[0].percentage.toFixed(2))})}</strong>`
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
                    </section>
                </div>

                <!-- Financial Overview Page -->
                <div class="report-page">
                    <section class="section">
                        <h2 class="section-title">Financial Overview</h2>
                        <p class="summary-intro">
                            Analyze your key financial metrics and understand how effectively you're managing income, expenses, and building savings.
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
                                    <div class="metric-value">${formatPercentage(summary.savingsRate)}</div>
                                </div>
                            </div>
                        </div>

                        <div class="subsection">
                            <h3 class="subsection-title">Savings Analysis</h3>
                            <div class="analysis-box-1">
                                <div class="analysis-summary">
                                    <div class="rating-indicator">
                                        <div class="rating-value" style="color: ${savingsStatus.color}">${formatPercentage(summary.savingsRate)}</div>
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

                                <div class="savings-ranges avoid-break">
                                    <p style="margin-bottom: 15px;"><strong>Understanding Your Savings Rate</strong></p>
                                    <p style="margin-bottom: 10px;">The savings rate is calculated as the percentage of income saved after expenses, and is sorted into 4 categories:</p>
                                    <p>• <span style="color: #2da77a">Excellent (>= 20%)</span> - Strong financial health and long-term security</p>
                                    <p>• <span style="color: #ff9800">Good (10% - 20%)</span> - Solid foundation for financial stability</p>
                                    <p>• <span style="color: #f44336">Fair (> 0% - 10%)</span> - Room for improvement in savings habits</p>
                                    <p>• <span style="color: #d32f2f">Needs Attention (0%)</span> - Immediate action recommended</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Monthly Trends Page -->
                <div class="report-page">
                    <section class="section">
                        <h2 class="section-title">Monthly Trends</h2>
                        <p class="summary-intro">
                            Visualize your financial journey month by month. By analyzing these patterns, you can identify seasonal variations in spending, income growth opportunities, and adjust your financial strategy accordingly.
                        </p>

                        <div class="subsection">
                            <h3 class="subsection-title">Monthly Breakdown</h3>
                            <table class="monthly-table">
                                <thead>
                                    <tr>
                                        <th style="text-align: left; width: 15%;">Month</th>
                                        <th style="width: 21.5%;">Income</th>
                                        <th style="width: 21.5%;">Expenses</th>
                                        <th style="width: 21.5%;">Net Savings</th>
                                        <th style="width: 20.5%;">Savings Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${monthlyTrend.map(month => {
                const savings = month.total_income - month.total_expenses;
                const savingsRate = month.total_income > 0
                    ? ((savings / month.total_income) * 100).toFixed(1)
                    : '0.0';
                const [year, monthNum] = month.month_year.split('-');
                const date = new Date(year, parseInt(monthNum) - 1);
                const monthName = date.toLocaleString('default', { month: 'long' });

                return `
                                            <tr>
                                                <td style="text-align: left;">${monthName} ${year}</td>
                                                <td>${formatCurrency(month.total_income)}</td>
                                                <td>${formatCurrency(month.total_expenses)}</td>
                                                <td>${formatCurrency(savings)}</td>
                                                <td>${formatPercentage(savingsRate)}</td>
                                            </tr>
                                        `;
            }).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div class="subsection">
                            <h3 class="subsection-title">Statistical Metrics</h3>
                            <div class="stats-container">
                                <div class="stats-row avoid-break">
                                    <div class="stats-header">
                                        <h4>Income</h4>
                                        <div class="monthly-average">
                                            <span class="value">${formatCurrency(metrics.income.average)}</span>
                                            <span class="label">monthly average</span>
                                        </div>
                                    </div>
                                    <div class="stats-details">
                                        <div class="stat-group">
                                            <div class="stat-item">
                                                <span class="label">Median</span>
                                                <span class="value">${formatCurrency(metrics.income.median)}</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="label">Std Dev</span>
                                                <span class="value">±${formatCurrency(metrics.income.stdDev)}</span>
                                            </div>
                                        </div>
                                        <div class="stat-group">
                                            <div class="stat-item">
                                                <span class="label">Min</span>
                                                <span class="value">${formatCurrency(metrics.income.min)}</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="label">Max</span>
                                                <span class="value">${formatCurrency(metrics.income.max)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="stats-row avoid-break">
                                    <div class="stats-header">
                                        <h4>Expenses</h4>
                                        <div class="monthly-average">
                                            <span class="value">${formatCurrency(metrics.expenses.average)}</span>
                                            <span class="label">monthly average</span>
                                        </div>
                                    </div>
                                    <div class="stats-details">
                                        <div class="stat-group">
                                            <div class="stat-item">
                                                <span class="label">Median</span>
                                                <span class="value">${formatCurrency(metrics.expenses.median)}</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="label">Std Dev</span>
                                                <span class="value">±${formatCurrency(metrics.expenses.stdDev)}</span>
                                            </div>
                                        </div>
                                        <div class="stat-group">
                                            <div class="stat-item">
                                                <span class="label">Min</span>
                                                <span class="value">${formatCurrency(metrics.expenses.min)}</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="label">Max</span>
                                                <span class="value">${formatCurrency(metrics.expenses.max)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="stats-row avoid-break">
                                    <div class="stats-header">
                                        <h4>Savings</h4>
                                        <div class="monthly-average">
                                            <span class="value">${formatCurrency(metrics.savings.average)}</span>
                                            <span class="label">monthly average</span>
                                        </div>
                                    </div>
                                    <div class="stats-details">
                                        <div class="stat-group">
                                            <div class="stat-item">
                                                <span class="label">Median</span>
                                                <span class="value">${formatCurrency(metrics.savings.median)}</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="label">Std Dev</span>
                                                <span class="value">±${formatCurrency(metrics.savings.stdDev)}</span>
                                            </div>
                                        </div>
                                        <div class="stat-group">
                                            <div class="stat-item">
                                                <span class="label">Min</span>
                                                <span class="value">${formatCurrency(metrics.savings.min)}</span>
                                            </div>
                                            <div class="stat-item">
                                                <span class="label">Max</span>
                                                <span class="value">${formatCurrency(metrics.savings.max)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Category Analysis Page -->
                <div class="report-page">
                    <section class="section">
                        <h2 class="section-title">Category Analysis</h2>
                        <p class="summary-intro">
                            Discover where your money flows and how it aligns with your financial goals. 
                            This breakdown helps identify areas where you're spending efficiently and where 
                            there might be opportunities to reallocate resources for better financial outcomes.
                        </p>

                        <div class="subsection">
                            <h3 class="subsection-title">Income Sources</h3>
                            <table class="monthly-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${incomeCategories.map(category => `
                                        <tr>
                                            <td style="text-align: left;">${category.category_name}</td>
                                            <td>${formatCurrency(category.total_amount)}</td>
                                            <td>${formatPercentage(category.percentage.toFixed(1))}%</</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                            
                            <div class="analysis-box" style="margin-top: 20px;">
                                <h4 style="color: #2da77a; margin: 0 0 15px 0;">Analysis of Income Sources</h4>
                                <p style="margin: 0 0 15px 0;">
                                    ${incomeCategories.length > 0
                ? `Your primary source of income is <strong>${incomeCategories[0].category_name}</strong> 
                                           representing <strong>${formatPercentage(incomeCategories[0].percentage.toFixed(1))}%</strong> of total income.
                                           ${incomeCategories.length > 1
                    ? `This is followed by <strong>${incomeCategories[1].category_name}</strong> at 
                                               <strong>${formatPercentage(incomeCategories[1].percentage.toFixed(1))}%</strong>.`
                    : ''}`
                : 'No income data available for this period.'}
                                </p>
                                <p style="margin: 0;">
                                    ${incomeCategories.length > 1
                ? `Having multiple income sources provides financial stability and reduces dependency on a single source. 
                                           Consider exploring opportunities to diversify income streams further for increased financial security.`
                : incomeCategories.length === 1
                    ? 'Consider exploring additional income sources to diversify your financial portfolio and reduce dependency on a single income stream.'
                    : ''}
                                </p>
                            </div>
                        </div>

                        <div class="subsection">
                            <h3 class="subsection-title">Expense Categories</h3>
                            <table class="monthly-table">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Amount</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${expenseCategories.map(category => `
                                        <tr>
                                            <td style="text-align: left;">${category.category_name}</td>
                                            <td>${formatCurrency(category.total_amount)}</td>
                                            <td>${formatPercentage(category.percentage.toFixed(1))}%</</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>

                            <div class="analysis-box avoid-break" style="margin-top: 20px;">
                                <h4 style="color: #EE6567; margin: 0 0 15px 0;">Analysis of Expense Categories</h4>
                                <p style="margin: 0 0 15px 0;">
                                    ${expenseCategories.length > 0
                ? `Your highest expense category is <strong>${expenseCategories[0].category_name}</strong> 
                                           at <strong>${formatPercentage(expenseCategories[0].percentage.toFixed(1))}%</strong> of total expenses.
                                           ${expenseCategories.length > 1
                    ? `The second highest is <strong>${expenseCategories[1].category_name}</strong> at 
                                               <strong>${formatPercentage(expenseCategories[1].percentage.toFixed(1))}%</strong>.`
                    : ''}`
                : 'No expense data available for this period.'}
                                </p>
                                <p style="margin: 0;">
                                    ${expenseCategories.length > 0
                ? `These top categories represent significant portions of your spending. 
                                           Consider reviewing these areas for potential optimization and savings opportunities, 
                                           while ensuring they align with your financial goals and priorities.`
                : ''}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Period Comparison Page -->
                <div class="report-page">
                    <section class="section">
                        <h2 class="section-title">Period Comparison</h2>
                        <p class="summary-intro">
                            Compare your spending patterns between the current period 
                            (<span class="highlight">${dateRange?.startDate} to ${dateRange?.endDate}</span>) and 
                            the previous period (<span class="highlight">${previousDateRange?.startDate} to ${previousDateRange?.endDate}</span>).
                        </p>

                        <div class="subsection">
                            <h3 class="subsection-title">Category Changes</h3>
                            <table class="monthly-table">
                                <thead>
                                    <tr>
                                        <th style="text-align: left; width: 25%;">Category</th>
                                        <th style="width: 19%;">Current</th>
                                        <th style="width: 19%;">Previous</th>
                                        <th style="width: 20.5%;">Change</th>
                                        <th style="width: 16.5%;">Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${(() => {
                const currentTotal = periodComparison.reduce((sum, cat) => sum + cat.current_period_expense, 0);
                const previousTotal = periodComparison.reduce((sum, cat) => sum + cat.previous_period_expense, 0);
                const totalChange = currentTotal - previousTotal;
                const totalPercentChange = previousTotal !== 0
                    ? ((totalChange / previousTotal) * 100).toFixed(1)
                    : 'New';

                return `
                                            ${periodComparison.map(category => {
                    const change = category.current_period_expense - category.previous_period_expense;
                    const percentChange = category.previous_period_expense !== 0
                        ? ((change / category.previous_period_expense) * 100).toFixed(1)
                        : category.current_period_expense > 0 ? 'New' : '-';
                    return `
                                                <tr>
                                                    <td style="text-align: left;">${category.category_name}</td>
                                                    <td>${formatCurrency(category.current_period_expense)}</td>
                                                    <td>${formatCurrency(category.previous_period_expense)}</td>
                                                    <td style="color: ${category.previous_period_expense === 0
                            ? '#666'
                            : change > 0 ? '#f44336' : change < 0 ? '#2da77a' : '#666'}">
                                                        ${category.previous_period_expense === 0
                            ? 'New'
                            : `${formatCurrency(Math.abs(change))} ${change > 0 ? '▲' : change < 0 ? '▼' : ''}`}
                                                    </td>
                                                    <td style="color: ${category.previous_period_expense === 0
                            ? '#666'
                            : change > 0 ? '#f44336' : change < 0 ? '#2da77a' : '#666'}">
                                                        ${category.previous_period_expense === 0
                            ? 'New'
                            : `${formatPercentage(percentChange, { showSign: true })} ${change > 0 ? '▲' : change < 0 ? '▼' : ''}`}
                                                    </td>
                                                </tr>
                                            `;
                }).join('')}
                                            <tr style="font-weight: bold; background-color: #f9f9f9;">
                                                <td style="text-align: left;">Total</td>
                                                <td>${formatCurrency(currentTotal)}</td>
                                                <td>${formatCurrency(previousTotal)}</td>
                                                <td style="color: ${totalChange > 0 ? '#f44336' : totalChange < 0 ? '#2da77a' : '#666'}">
                                                    ${formatCurrency(Math.abs(totalChange))} ${totalChange > 0 ? '▲' : totalChange < 0 ? '▼' : ''}
                                                </td>
                                                <td style="color: ${previousTotal === 0
                        ? '#666'
                        : totalChange > 0 ? '#f44336' : totalChange < 0 ? '#2da77a' : '#666'}">
                                                    ${previousTotal === 0
                        ? 'New'
                        : `${formatPercentage(totalPercentChange, { showSign: true })} ${totalChange > 0 ? '▲' : totalChange < 0 ? '▼' : ''}`}
                                                </td>
                                            </tr>
                                        `;
            })()}
                                </tbody>
                            </table>

                            <div class="analysis-box avoid-break" style="margin-top: 20px;">
                                <h4 style="color: #444; margin: 0 0 15px 0;">Period Analysis</h4>
                                <p style="margin: 0 0 15px 0;">
                                    ${(() => {
                const totalCurrentExpense = periodComparison.reduce((sum, cat) => sum + cat.current_period_expense, 0);
                const totalPreviousExpense = periodComparison.reduce((sum, cat) => sum + cat.previous_period_expense, 0);
                const totalChange = totalCurrentExpense - totalPreviousExpense;
                const percentChange = totalPreviousExpense !== 0
                    ? ((totalChange / totalPreviousExpense) * 100).toFixed(1)
                    : null;

                // Find categories with significant changes
                const significantChanges = periodComparison
                    .filter(cat => {
                        const change = cat.current_period_expense - cat.previous_period_expense;
                        const percentChange = cat.previous_period_expense !== 0
                            ? (change / cat.previous_period_expense) * 100
                            : 0;
                        return Math.abs(percentChange) > 20; // Consider changes over 20% significant
                    })
                    .sort((a, b) => {
                        const changeA = Math.abs(a.current_period_expense - a.previous_period_expense);
                        const changeB = Math.abs(b.current_period_expense - b.previous_period_expense);
                        return changeB - changeA;
                    });

                return `
                                            Overall spending has ${totalChange > 0 ? 'increased' : 'decreased'} by 
                                            <strong>${formatCurrency(Math.abs(totalChange))}</strong>
                                            ${percentChange ? ` (${formatPercentage(Math.abs(percentChange))})` : ''} 
                                            compared to the previous period.
                                            ${significantChanges.length > 0
                        ? `\n\nNotable changes in spending:`
                        : ''}
                                        `;
            })()}
                                </p>
                                <ul style="margin: 0; padding-left: 20px;">
                                    ${periodComparison
                .filter(cat => {
                    const change = cat.current_period_expense - cat.previous_period_expense;
                    const percentChange = cat.previous_period_expense !== 0
                        ? (change / cat.previous_period_expense) * 100
                        : 0;
                    return Math.abs(percentChange) > 20;
                })
                .map(cat => {
                    const change = cat.current_period_expense - cat.previous_period_expense;
                    const percentChange = cat.previous_period_expense !== 0
                        ? ((change / cat.previous_period_expense) * 100).toFixed(1)
                        : 'N/A';
                    return `
                                                <li style="margin-bottom: 8px;">
                                                    <strong>${cat.category_name}</strong>: 
                                                    ${change > 0 ? 'Increased' : 'Decreased'} by 
                                                    ${formatCurrency(Math.abs(change))}
                                                    ${percentChange !== 'N/A' ? ` (${formatPercentage(percentChange, { showSign: true })})` : ''}
                                                </li>
                                            `;
                }).join('')}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>

                <!-- Recommendations Page -->
                <div class="report-page">
                    <section class="section">
                        <h2 class="section-title">Recommendations & Next Steps</h2>
                        <p class="summary-intro">
                            Based on your financial data analysis, here are key recommendations to help optimize your financial health and achieve your goals.
                        </p>

                        <div class="analysis-box">
                            ${(() => {
                const recommendations = [];

                // Savings recommendations
                if (summary.savingsRate < 20) {
                    recommendations.push(`
                                        <li>Consider increasing your savings rate (currently ${formatPercentage(summary.savingsRate)}) by identifying non-essential expenses.</li>
                                    `);
                }

                // Income diversification
                if (incomeCategories.length < 2) {
                    recommendations.push(`
                                        <li>Look into additional income streams to reduce dependency on a single source of income.</li>
                                    `);
                }

                // Expense optimization
                if (expenseCategories.length > 0) {
                    const topExpense = expenseCategories[0];
                    if (topExpense.percentage > 40) {
                        recommendations.push(`
                                            <li>Review your ${topExpense.category_name.toLowerCase()} expenses which represent ${formatPercentage(topExpense.percentage.toFixed(1))}% of total expenses.</li>
                                        `);
                    }
                }

                // Monthly volatility
                if (metrics.expenses.stdDev > metrics.expenses.average * 0.2) {
                    recommendations.push(`
                                        <li>Work on stabilizing monthly expenses to reduce significant variations in spending.</li>
                                    `);
                }

                // Add default recommendation if none apply
                if (recommendations.length === 0) {
                    recommendations.push(`
                                        <li>Continue maintaining your excellent financial habits while looking for optimization opportunities.</li>
                                    `);
                }

                return `
                                    <h4 style="color: #444; margin: 0 0 15px 0;">Key Recommendations</h4>
                                    <ul style="margin: 0; padding-left: 20px;">
                                        ${recommendations.join('')}
                                    </ul>
                                `;
            })()}
                        </div>

                        <div style="margin-top: 40px; text-align: center; color: #666; font-size: 14px; padding: 20px;">
                            <p style="margin: 0;">End of Report</p>
                            <p style="margin: 5px 0 0 0;">Generated by Dobbi Financial Analytics</p>
                        </div>
                    </section>
                </div>

                <!-- Remove the old footer -->
            </body>
            </html>
        `;

        // Print to file
        console.log('Generating PDF file...');
        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false,
            width: 595.28, // A4 width in points (72 dpi)
            height: 841.89, // A4 height in points (72 dpi)
            margins: {
                top: 71, // 25mm in points
                right: 57, // 20mm in points
                bottom: 71, // 25mm in points
                left: 57 // 20mm in points
            }
        });
        console.log('PDF generated successfully at:', uri);

        return uri;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error(`PDF generation failed: ${error.message}`);
    }
};