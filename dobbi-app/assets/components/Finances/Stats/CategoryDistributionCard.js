import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryPie, VictoryLabel } from 'victory-native';
import Card from '../../common/Card';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

const colorScale = [
    '#4CAF50', '#2196F3', '#FF9800', '#F44336',
    '#9C27B0', '#FFC107', '#03A9F4', '#8BC34A',
    '#E91E63', '#00BCD4', '#CDDC39', '#009688',
    '#673AB7', '#FF5722', '#795548', '#607D8B',
];

const defaultChartData = [
    { x: '', y: 0, color: colorScale[0] }, // removed label property
];

export const CategoryDistributionCard = ({ data, title, startAngle=0, endAngle=360, height, padding }) => {
    const [chartData, setChartData] = useState(defaultChartData);

    useEffect(() => {
        setTimeout(() => {
            setChartData(data.map((item, index) => ({
                x: `${item.percentage.toFixed(1)}%`,
                y: item.percentage,
                color: colorScale[index % colorScale.length],
            })));
        }, 300);
    }, [data]);

    // Custom label component
    const CustomLabel = (props) => {
        const { datum } = props;
        return datum.y > 1 ? (
            <VictoryLabel
                {...props}
                text={`${datum.y.toFixed(1)}%`}
            />
        ) : null;
    };

    return (
        <Card 
            title={title}
            style={styles.card}>
            <View style={styles.chartWrapper}>
            <VictoryPie
                animate={{
                    easing: 'bounce', 
                    duration: 2000,
                }}
                startAngle={startAngle}
                endAngle={endAngle}
                width={screenWidth - 45}
                height={height}
                padding={padding}
                data={chartData}
                x="x"
                y="y"
                colorScale={chartData.map(item => item.color)}
                labelPosition="centroid"
                labelRadius={({ datum }) => datum.y > 9 ? 130 : 130 }
                innerRadius={50}
                padAngle={2}
                labelComponent={<CustomLabel />}
                style={{
                    labels: { fill: '#333', fontSize: 16, fontWeight: 'bold',},
                }}
            />
            </View>
            <View style={styles.legend}>
            {data.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                <View
                    style={[
                    styles.legendColor,
                    { backgroundColor: colorScale[index % colorScale.length] },
                    ]}
                />
                <Ionicons name={item.category_icon} size={20} color="#666666" />
                <Text style={styles.legendText}>{item.category_name}</Text>
                </View>
            ))}
            </View>
        </Card>
        );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    chartWrapper: {
        alignItems: 'center',
        marginTop: 16,
    },
    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4,
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 4,
    },
    legendText: {
        fontSize: 14,
        color: '#666666',
        marginLeft: 4,
    },
});