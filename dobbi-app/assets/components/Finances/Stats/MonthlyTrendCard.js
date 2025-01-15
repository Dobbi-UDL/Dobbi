import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLabel, VictoryLegend } from 'victory-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../../common/Card';
import { formatCurrency, formatCompactCurrency } from '../../../../utils/numberHelpers';

const screenWidth = Dimensions.get('window').width;

export const MonthlyTrendCard = ({ data }) => {
    const [modalVisible, setModalVisible] = useState(false);

    // Check if there's enough data to create a trend chart
    if (!data || data.length < 2) {
        return (
            <Card title="Monthly Income vs Expenses" style={styles.card}>
                <View style={styles.noDataContainer}>
                    <MaterialCommunityIcons
                        name="chart-line"
                        size={50}
                        color="#CCCCCC"
                    />
                    <Text style={styles.noDataText}>
                        Not enough data to display monthly trend.
                        Track more months to see your financial progression.
                    </Text>
                </View>
            </Card>
        );
    }

    // Transform data for chart with better validation
    const incomeData = data
        .filter(item => item && item.month_year && !isNaN(parseFloat(item.total_income)))
        .map((item) => ({
            x: new Date(item.month_year + '-01'),
            y: Number(item.total_income)
        }))
        .sort((a, b) => a.x - b.x);

    const expensesData = data
        .filter(item => item && item.month_year && !isNaN(parseFloat(item.total_expenses)))
        .map((item) => ({
            x: new Date(item.month_year + '-01'),
            y: Number(item.total_expenses)
        }))
        .sort((a, b) => a.x - b.x);

    // Find highest value to set domain
    const maxVal = Math.max(
        Math.max(...incomeData.map((item) => item.y)),
        Math.max(...expensesData.map((item) => item.y))
    );

    // Find lowest and highest dates to set domain
    const minDate = new Date(data[0].month_year + '-01');
    const maxDate = new Date(data[data.length - 1].month_year + '-01');
    minDate.setMonth(minDate.getMonth() - 1);
    maxDate.setMonth(maxDate.getMonth() + 1);
    const minDomainDate = minDate.getTime() + 15 * 24 * 60 * 60 * 1000;
    const maxDomainDate = maxDate.getTime() - 15 * 24 * 60 * 60 * 1000

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    return (
        <Card title="Monthly Income vs Expenses Trend" style={styles.card}>
            <View style={styles.chartWrapper}>
                <VictoryChart
                    theme={VictoryTheme.material}
                    width={screenWidth - 40}
                    height={360}
                    padding={{ top: 20, bottom: 90, left: 50, right: 20 }} // increased bottom padding
                    scale={{ x: "time" }}
                    domain={{ 
                        y: [0, maxVal * 1.1],
                        x: [minDate, maxDate] 
                    }}
                >
                    <VictoryAxis
                        tickFormat={(x) => {
                            const date = new Date(x);
                            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                             'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return `${monthNames[date.getMonth()]} ${date.getFullYear().toString().substr(-2)}`;
                        }}
                        style={{
                            tickLabels: { 
                                fontSize: 12,
                                padding: 5,
                                angle: -45,
                                textAnchor: 'end'
                            }
                        }}
                    />
                    <VictoryAxis
                        dependentAxis
                        tickFormat={(y) => formatCompactCurrency(y)}
                        style={{
                            tickLabels: { fontSize: 14, padding: 5 }
                        }}
                    />
                    <VictoryLine
                        data={incomeData}
                        interpolation="monotoneX"
                        style={{
                            data: { stroke: "#4CAF50", strokeWidth: 3 },
                        }}
                    />
                    <VictoryLine
                        data={expensesData}
                        interpolation="monotoneX"
                        style={{
                            data: { stroke: "#F44336", strokeWidth: 3 },
                        }}
                    />
                    <VictoryLegend
                        x={screenWidth / 2 - 110}
                        y={330}
                        orientation="horizontal"
                        gutter={25}
                        style={{ border: { stroke: "none" }, labels: { fontSize: 14 } }}
                        data={[
                            { name: "Income", symbol: { fill: "#4CAF50" } },
                            { name: "Expenses", symbol: { fill: "#F44336" } }
                        ]}
                    />
                </VictoryChart>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={styles.statsButton}
                >
                    <MaterialCommunityIcons name="chart-box" size={20} color="#333" />
                    <Text style={styles.statsButtonText}>View Metrics</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity
                onPress={toggleModal}
                style={styles.footer}
            >
                <MaterialCommunityIcons name="information" size={20} color="#333" />
                <Text style={styles.footerText}>
                    Learn more about interpreting this trend chart
                </Text>
            </TouchableOpacity>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    chartWrapper: {
        alignItems: 'center',
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    noDataText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
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
    legendItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 4,
    },
    legendItemText: {
        marginLeft: 4,
        fontSize: 12,
        color: '#666666',
    },
    buttonContainer: {
        alignItems: 'center',
        paddingTop: 16,
    },
    statsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 8,
    },
    statsButtonText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
});

export default MonthlyTrendCard;