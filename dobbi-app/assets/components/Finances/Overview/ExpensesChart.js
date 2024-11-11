import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Card from '../../common/Card';
import { styles } from './ExpensesChart.styles';


const ExpensesChart = () => {
    const screenWidth = Dimensions.get('window').width;
    const chartConfig = {
        backgroundGradientFrom: '#ffffff',
        backgroundGradientTo: '#ffffff',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    const data = [
        { name: 'Category 1', population: 10, color: '#EE6567', legendFontColor: '#7F7F7F' }, // Main color
        { name: 'Category 2', population: 12, color: '#F5A623', legendFontColor: '#7F7F7F' }, // Orange
        { name: 'Category 3', population: 8, color: '#F8E71C', legendFontColor: '#7F7F7F' }, // Yellow
        { name: 'Category 4', population: 15, color: '#7ED321', legendFontColor: '#7F7F7F' }, // Light Green
        { name: 'Category 5', population: 9, color: '#50E3C2', legendFontColor: '#7F7F7F' }, // Turquoise
        { name: 'Category 6', population: 7, color: '#4A90E2', legendFontColor: '#7F7F7F' }, // Blue
        { name: 'Category 7', population: 11, color: '#9013FE', legendFontColor: '#7F7F7F' }, // Purple
        { name: 'Category 8', population: 13, color: '#BD10E0', legendFontColor: '#7F7F7F' }, // Magenta
        { name: 'Category 9', population: 6, color: '#FF7F50', legendFontColor: '#7F7F7F' }, // Coral
        { name: 'Category 10', population: 14, color: '#FFA07A', legendFontColor: '#7F7F7F' }, // Light Salmon
    ];

    return (
        <Card 
            title="Expense Breakdown"
            cardStyle={styles.card}>

                <PieChart
                    data={data}
                    width={screenWidth - 80}    
                    height={220}
                    chartConfig={chartConfig}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="24"
                    style={{
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                    }}
                />

        </Card>
    );
};

export default ExpensesChart;