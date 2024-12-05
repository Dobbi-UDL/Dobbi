
import * as Print from 'expo-print';

export const generatePDF = async () => {
    try {
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
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">Dobbi</div>
                    <h2>Financial Report</h2>
                    <p>Generated on ${new Date().toLocaleDateString()}</p>
                </div>

                <div class="section">
                    <h3>Summary</h3>
                    <table>
                        <tr>
                            <th>Total Revenue</th>
                            <td>$10,000</td>
                        </tr>
                        <tr>
                            <th>Total Expenses</th>
                            <td>$5,000</td>
                        </tr>
                        <tr>
                            <th>Net Profit</th>
                            <td>$5,000</td>
                        </tr>
                    </table>
                </div>

                <div class="section">
                    <h3>Monthly Breakdown</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Month</th>
                                <th>Revenue</th>
                                <th>Expenses</th>
                                <th>Profit</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>January</td>
                                <td>$3,000</td>
                                <td>$1,500</td>
                                <td>$1,500</td>
                            </tr>
                            <tr>
                                <td>February</td>
                                <td>$3,500</td>
                                <td>$1,700</td>
                                <td>$1,800</td>
                            </tr>
                            <tr>
                                <td>March</td>
                                <td>$3,500</td>
                                <td>$1,800</td>
                                <td>$1,700</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="footer">
                    <p>This is a computer-generated document.</p>
                </div>
            </body>
            </html>
        `;

        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
            base64: false
        });

        return uri;
    } catch (error) {
        console.error('PDF generation error:', error);
        throw new Error('Unable to generate PDF file.');
    }
};