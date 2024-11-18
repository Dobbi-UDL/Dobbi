import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Card from '../../common/Card';
import { styles } from './ExpensesChart.styles';


const Chart = () => {
    const data = [
        { name: 'Category A', population: 40, color: '#f00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Category B', population: 30, color: '#0f0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Category C', population: 20, color: '#00f', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        { name: 'Category D', population: 10, color: '#ff0', legendFontColor: '#7F7F7F', legendFontSize: 15 },
    ];

    const screenWidth = Dimensions.get('window').width;

    const chartConfig = {
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <PieChart
            data={data}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            style={{
                borderWidth: 1,
                borderColor: '#E0E0E0',
            }}
        />           
    );
};

export default Chart;
