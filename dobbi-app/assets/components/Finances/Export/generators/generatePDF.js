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
            dateRange
        } = data;

        // Validate required data properties
        if (!summary || !periodComparison || !expenseCategories || !incomeCategories || !monthlyTrend) {
            console.error('Missing required data:', { summary, periodComparison, expenseCategories, incomeCategories, monthlyTrend });
            throw new Error('Missing required data for PDF generation');
        }

        // Use the imported base64 logo and brand directly
        const dobbiLogo = DOBBI_LOGO_BASE64;
        const dobbiBrand = DOBBI_BRAND_BASE64;

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