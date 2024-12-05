import * as FileSystem from 'expo-file-system';

export const generateCSV = async () => {
    try {
        // Create CSV content
        const headers = ['Date', 'Description', 'Revenue', 'Expenses', 'Profit'];
        const data = [
            ['2024-01-15', 'Regular Sales', '3000', '1500', '1500'],
            ['2024-02-15', 'Special Promotion', '3500', '1700', '1800'],
            ['2024-03-15', 'Standard Month', '3500', '1800', '1700'],
        ];

        // Combine headers and data
        const csvContent = [
            headers.join(','),
            ...data.map(row => row.join(','))
        ].join('\n');

        // Create temporary file
        const tempUri = FileSystem.documentDirectory + 'temp.csv';
        await FileSystem.writeAsStringAsync(tempUri, csvContent);

        return tempUri;
    } catch (error) {
        console.error('CSV generation error:', error);
        throw new Error('Unable to generate CSV file.');
    }
};