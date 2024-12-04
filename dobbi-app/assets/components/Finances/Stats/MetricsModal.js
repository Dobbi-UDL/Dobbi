import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CustomModal } from '../../common/Modal';

const calculateStats = (data, key) => {
    const values = data.map(item => item[key]);
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

const formatCurrency = (value) => {
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const StatRow = ({ label, income, expenses, savings }) => (
    <View style={styles.statRow}>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, styles.incomeValue]}>{formatCurrency(income)}</Text>
        <Text style={[styles.statValue, styles.expensesValue]}>{formatCurrency(expenses)}</Text>
        <Text style={[styles.statValue, styles.savingsValue]}>{formatCurrency(savings)}</Text>
    </View>
);

export const MetricsModal = ({ visible, onClose, data }) => {
    if (!data || data.length === 0) return null;

    const incomeStats = calculateStats(data, 'total_income');
    const expenseStats = calculateStats(data, 'total_expenses');
    const savingsStats = data.map(item => ({
        savings: item.total_income - item.total_expenses
    }));
    const savings = calculateStats(savingsStats, 'savings');

    return (
        <CustomModal
            visible={visible}
            onClose={onClose}
            title="Detailed Statistics"
        >
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Metric</Text>
                    <Text style={[styles.headerCell, styles.incomeValue]}>Income</Text>
                    <Text style={[styles.headerCell, styles.expensesValue]}>Expenses</Text>
                    <Text style={[styles.headerCell, styles.savingsValue]}>Savings</Text>
                </View>

                <StatRow label="Total" income={incomeStats.total} expenses={expenseStats.total} savings={savings.total} />
                <StatRow label="Monthly Avg" income={incomeStats.average} expenses={expenseStats.average} savings={savings.average} />
                <StatRow label="Median" income={incomeStats.median} expenses={expenseStats.median} savings={savings.median} />
                <StatRow label="Std Dev" income={incomeStats.stdDev} expenses={expenseStats.stdDev} savings={savings.stdDev} />
                <StatRow label="Range" income={incomeStats.range} expenses={expenseStats.range} savings={savings.range} />
                <StatRow label="Minimum" income={incomeStats.min} expenses={expenseStats.min} savings={savings.min} />
                <StatRow label="Maximum" income={incomeStats.max} expenses={expenseStats.max} savings={savings.max} />
            </ScrollView>

            <TouchableOpacity onPress={onClose} style={styles.footer}>
                <MaterialCommunityIcons name="information" size={20} color="#666" />
                <Text style={styles.footerText}>
                    These statistics help you understand your financial patterns over time
                </Text>
            </TouchableOpacity>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 0,
    },
    headerRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#E0E0E0',
        marginBottom: 8,
    },
    headerCell: {
        flex: 1,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'right',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    statLabel: {
        flex: 1,
        fontSize: 14,
        color: '#666',
    },
    statValue: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'right',
    },
    incomeValue: {
        color: '#4CAF50',
    },
    expensesValue: {
        color: '#F44336',
    },
    savingsValue: {
        color: '#2196F3',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    footerText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
        flex: 1,
    },
});

