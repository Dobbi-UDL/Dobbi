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

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <body>
                <h1>Financial Summary Report</h1>
                <p>${dateRange?.startDate} - ${dateRange?.endDate}</p>
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