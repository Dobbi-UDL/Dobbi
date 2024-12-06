
export const calculateMetrics = (data) => {
    if (!data || data.length === 0) return null;

    const calculateStats = (values) => {
        const sum = values.reduce((a, b) => a + b, 0);
        const avg = sum / values.length;
        const sorted = [...values].sort((a, b) => a - b);
        const median = values.length % 2 === 0
            ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
            : sorted[Math.floor(values.length / 2)];
        const variance = values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);
        const min = Math.min(...values);
        const max = Math.max(...values);

        return {
            total: sum,
            average: avg,
            median: median,
            stdDev: stdDev,
            range: max - min,
            min: min,
            max: max
        };
    };

    const incomeValues = data.map(item => item.total_income);
    const expenseValues = data.map(item => item.total_expenses);
    const savingsValues = data.map(item => item.total_income - item.total_expenses);

    return {
        income: calculateStats(incomeValues),
        expenses: calculateStats(expenseValues),
        savings: calculateStats(savingsValues)
    };
};


