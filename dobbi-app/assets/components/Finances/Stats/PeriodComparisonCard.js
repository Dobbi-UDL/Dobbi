import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme, VictoryLabel, VictoryGroup } from "victory-native";
import Card from '../../common/Card';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ComparisonExplanationModal } from './ComparisonExplanationModal';

const screenWidth = Dimensions.get('window').width;

export const PeriodComparisonCard = ({ data }) => {
    const [explanationModalVisible, setExplanationModalVisible] = useState(false);

    // Sort data in reverse order of data, so that the first item is at the bottom like the chart
    const sortedData = data.slice().reverse();

    const currentPeriodData = sortedData.map(item => ({ x: item.category_name, y: item.current_period_expense, icon: item.category_icon }));
    const previousPeriodData = sortedData.map(item => ({ x: item.category_name, y: item.previous_period_expense, icon: item.category_icon }));
    console.log('currentPeriodData:', currentPeriodData);

    const totalCurrentExpense = currentPeriodData.reduce((sum, item) => sum + item.y, 0);
    const totalPreviousExpense = previousPeriodData.reduce((sum, item) => sum + item.y, 0);
    const expenseDifference = totalCurrentExpense - totalPreviousExpense;
    const percentageChange = ((totalCurrentExpense - totalPreviousExpense) / totalPreviousExpense) * 100;
    const isIncrease = totalCurrentExpense > totalPreviousExpense;

    const chartHeight = 80 * data.length;
    const barHeight = 20;
    
    const barWidth = 25;
    const groupOffset = 25;
    const iconSpacing = (chartHeight - 75) / (data.length - 1);

    // Get the maximum value and round up to next hundred
    const maxExpense = Math.max(
        ...currentPeriodData.map(d => d.y),
        ...previousPeriodData.map(d => d.y)
    );
    const maxDomain = Math.ceil(maxExpense / 100) * 100;

    const accentColor = isIncrease ? '#EE6567' : '#4CAF50';

    const toggleExplanationModal = () => {
        setExplanationModalVisible(!explanationModalVisible);
    };

    return (
        <Card style={styles.card}>
            <Text style={styles.title}>Expense Comparison</Text>
            
            <View style={styles.comparisonBox}>
                <View style={styles.periodBox}>
                    <Text style={styles.periodLabel}>Previous Period</Text>
                    <Text style={styles.periodAmount}>${totalPreviousExpense}</Text>
                </View>
                <MaterialCommunityIcons
                    name="arrow-right-bold"
                    size={24}
                    color="#666"
                />
                <View style={styles.periodBox}>
                    <Text style={styles.periodLabel}>Current Period</Text>
                    <Text style={[styles.periodAmount]}>${totalCurrentExpense}</Text>
                </View>
            </View>

            <View style={[styles.trendBox, { backgroundColor: accentColor + '15' }]}>
                <View style={styles.trendContent}>
                    <MaterialCommunityIcons
                        name={isIncrease ? "arrow-up" : "arrow-down"}
                        size={24}
                        color={accentColor}
                    />
                    <Text style={styles.trendText}>
                        <Text style={[styles.trendPercentage, { color: accentColor }]}>
                            {'Spending '}{isIncrease ? 'Increased' : 'Decreased'}{' '}{Math.abs(percentageChange).toFixed(1)}%{'\n'}
                        </Text>
                        <Text style={styles.trendDescription}>
                            {'Your expenses went '}{isIncrease ? 'up' : 'down'} ${Math.abs(expenseDifference)}
                        </Text>
                    </Text>
                </View>
            </View>

            <View style={styles.chartWrapper}>
                <View style={[styles.iconsColumn, { height: chartHeight }]}>
                    {data.map((item, index) => (
                        <View 
                            key={index} 
                            style={[
                                styles.iconItem, 
                                { 
                                    top: (index * iconSpacing) + 12.5, // Align with bars
                                }
                            ]}
                        >
                            <Ionicons name={item.category_icon} size={22} color="#666666" />
                        </View>
                    ))}
                </View>
                <View style={styles.chartContainer}>
                    <VictoryChart
                        theme={VictoryTheme.clean}
                        domainPadding={{ x: 25 }}
                        width={screenWidth - 60} // Adjust width to accommodate icons
                        height={chartHeight}
                        padding={{ top: 0, bottom: 25, left: 20, right: 45 }} // Reduced left padding
                        domain={{ y: [0, maxDomain+200] }}
                    >
                        <VictoryAxis
                            style={{
                                tickLabels: { fill: 'transparent' }, // Hide default labels
                                grid: { stroke: '#EEEEEE', strokeDasharray: '8' },
                            }}
                        />
                        <VictoryAxis
                            dependentAxis
                            tickFormat={(t) => t}
                            style={{
                                tickLabels: { fontSize: 14, fill: '#666666', angle: 0 },
                                grid: { stroke: '#EEEEEE', strokeDasharray: '8' },
                            }}
                        />
                        <VictoryGroup offset={25} horizontal>
                            <VictoryBar
                                data={currentPeriodData}
                                x="x"
                                y="y"
                                labels={({ datum }) => `$${datum.y}`}
                                labelComponent={
                                    <VictoryLabel 
                                        dx={8} 
                                        textAnchor="start"
                                        style={{ fontSize: 16, fontWeight: 'bold' }}
                                    />
                                }
                                style={{
                                    data: { fill: "#4CAF50", width: 25 },
                                }}
                            />
                            <VictoryBar
                                data={previousPeriodData}
                                x="x"
                                y="y"
                                labels={({ datum }) => `$${datum.y}`}
                                labelComponent={
                                    <VictoryLabel 
                                        dx={8} 
                                        textAnchor="start"
                                        style={{ fontSize: 16, fontWeight: 'bold' }}
                                    />
                                }
                                style={{
                                    data: { fill: "#2196F3", width: 25 },
                                }}
                            />
                        </VictoryGroup>
                    </VictoryChart>
                </View>
            </View>
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#2196F3" }]} />
                    <Text style={styles.legendText}>Previous Period</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#4CAF50" }]} />
                    <Text style={styles.legendText}>Current Period</Text>
                </View>
            </View>
            <View style={styles.categoryLegend}>
                {data.map((item, index) => (
                    <View key={index} style={styles.categoryLegendItem}>
                        <Ionicons name={item.category_icon} size={20} color="#666666" />
                        <Text style={styles.categoryLegendText}>{item.category_name}</Text>
                    </View>
                ))}
            </View>
            <TouchableOpacity
                onPress={toggleExplanationModal}
                style={styles.footer}
            >
                <MaterialCommunityIcons name="information" size={20} color="#333" />
                <Text style={styles.footerText}>
                    Learn more about period comparison and how to interpret these changes
                </Text>
            </TouchableOpacity>
            <ComparisonExplanationModal
                visible={explanationModalVisible}
                onClose={toggleExplanationModal}
                currentTotal={totalCurrentExpense}
                previousTotal={totalPreviousExpense}
                percentageChange={percentageChange}
            />
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 16,
    },
    totalExpenseWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginBottom: 24,
    },
    periodTotalContainer: {
        alignItems: 'center',
    },
    periodLabel: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    comparisonContainer: {
        alignItems: 'center',
    },
    changeWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    differenceAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    totalExpenseContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    expenseItem: {
        alignItems: 'center',
    },
    expenseLabel: {
        fontSize: 12,
        color: '#666666',
    },
    expenseAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333333',
    },
    expenseDifference: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
        marginBottom: 4,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    legendColor: {
        width: 16,
        height: 16,
        borderRadius: 8,
        marginRight: 4,
    },
    legendText: {
        fontSize: 12,
        color: '#666666',
    },
    categoryLegend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 16,
        paddingHorizontal: 8,
    },
    categoryLegendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        marginVertical: 4,
    },
    categoryLegendText: {
        fontSize: 12,
        color: '#666666',
        marginLeft: 4,
    },
    axisLabel: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 16,
    },
    iconsColumn: {
        width: 30,
        position: 'relative',
    },
    iconItem: {
        position: 'absolute',
        left: 0,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartContainer: {
        flex: 1,
        
    },
    iconContainer: {
        position: 'absolute',
        left: 10,
        top: 20,
    },
    iconWrapper: {
        position: 'absolute',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        marginBottom: 4,
    },
    footerText: {
        fontSize: 14,
        color: '#333333',
        textAlign: 'center',
        fontWeight: '400',
        marginLeft: 8,
        flex: 1,
        flexWrap: 'wrap',
    },
    comparisonBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginBottom: 12,  // Reduced from 24
    },
    trendBox: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    trendContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    trendText: {
        marginLeft: 8,
        fontSize: 16,
    },
    trendPercentage: {
        fontSize: 19,
        fontWeight: 'bold',
    },
    trendDescription: {
        color: '#666',
        fontSize: 16,
    },
    periodBox: {
        flex: 1,
        alignItems: 'center',
    },
    periodLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    periodAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    headerBox: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
    },
});

