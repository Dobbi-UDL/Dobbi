import React from 'react';
import { Dimensions, View, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Card from '../../common/Card';
import { styles } from './ExpensesChart.styles';

const ExpensesChart = () => {
    const screenWidth = Dimensions.get('window').width;
    const chartConfig = {
        backgroundGradientFrom: '#FFF5F5',
        backgroundGradientTo: '#FFF5F5',
        color: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    };

    // Calculate total for percentages
    const rawData = [
        { name: 'Entertainment', amount: 95.98, color: '#EE6567' },  // Primary accent color
        { name: 'Food', amount: 120.45, color: '#F5A623' },         // Text secondary color
        { name: 'Transport', amount: 45, color: '#F8E71C' },        // Text primary color
    ];

    const total = rawData.reduce((sum, item) => sum + item.amount, 0);

    const data = rawData.map(item => ({
        name: item.name,
        population: item.amount,
        color: item.color,
        legendFontColor: '#2D3436',
        legendFontSize: 14,
        percentage: ((item.amount / total) * 100).toFixed(1)
    }));

    return (
        <Card
            title="Expense Breakdown"
            cardStyle={styles.card}>
            <View style={styles.chartContainer}>
                <PieChart
                    data={data}
                    width={screenWidth - 80}
                    height={200}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="70"
                    center={[0, 0]}
                    hasLegend={false}
                />

                <View style={styles.legendContainer}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.legendItem}>
                            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                            <View style={styles.legendText}>
                                <Text style={styles.legendLabel}>{item.name}</Text>
                                <Text style={styles.legendValue}>${item.population.toFixed(2)} ({item.percentage}%)</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </Card>
    );
};



export default ExpensesChart;