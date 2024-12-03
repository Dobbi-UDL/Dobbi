import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Card from '../../common/Card';
import { SavingsRateModal } from './SavingsRateModal'; 

export const SummaryCard = ({ summary }) => {
    const [explanationModalVisible, setExplanationModalVisible] = useState(false);
    const [financialHealthMessage, setFinancialHealthMessage] = useState('');

    useEffect(() => {
        setFinancialHealthMessage(getFinancialHealthMessage());
    }, [summary]);

    const renderSummaryItem = (label, amount, iconName, color) => (
        <View style={styles.summaryItem}>
            <View style={[styles.iconBackground, { backgroundColor: color + '20' }]}>
                <MaterialCommunityIcons
                    name={iconName}
                    size={30}
                    color={color}
                />
            </View>
            <Text style={styles.summaryLabel}>{label}</Text>
            <Text style={[styles.summaryAmount, { color: color }]}>{amount}</Text>
        </View>
    );

    const getFinancialHealthMessage = () => {
        const messages = {
            excellent: [
                "Fantastic job! Your savings rate is excellent. Keep up the great work!",
                "You're doing amazing! Your financial health is in top shape.",
                "Outstanding savings rate! You're on the right track."
            ],
            good: [
                "Good job! Your savings rate is solid. Keep pushing for even better results.",
                "You're doing well! A little more effort and you'll reach an excellent savings rate.",
                "Nice work! Your financial health is good, but there's always room for improvement."
            ],
            moderate: [
                "You're saving, but there's room for improvement. Consider reviewing your expenses.",
                "Decent job! Try to increase your savings rate for better financial health.",
                "You're on the right path, but aim to save a bit more each month."
            ],
            poor: [
                "You're spending more than you earn. Consider reviewing your expenses.",
                "It's time to take a closer look at your spending habits. Aim to save more.",
                "Your financial health needs attention. Try to cut down on unnecessary expenses."
            ]
        };

        const excellentThreshold = 20;
        const goodThreshold = 10;
        const moderateThreshold = 0;

        if (summary.savingsRate > excellentThreshold) {
            return messages.excellent[Math.floor(Math.random() * messages.excellent.length)];
        } else if (summary.savingsRate > goodThreshold) {
            return messages.good[Math.floor(Math.random() * messages.good.length)];
        } else if (summary.savingsRate > moderateThreshold) {
            return messages.moderate[Math.floor(Math.random() * messages.moderate.length)];
        } else {
            return messages.poor[Math.floor(Math.random() * messages.poor.length)];
        }
    };

    const toggleExplanationModal = () => {
        setExplanationModalVisible(!explanationModalVisible);
    };

    return (
        <Card title="Financial Summary" style={styles.card}>
            <View style={styles.summaryContainer}>
                {renderSummaryItem('Total Income', (`$${summary.totalIncome}`), 'cash-plus', '#4CAF50')}
                {renderSummaryItem('Total Expenses', (`$${summary.totalExpenses}`), 'cash-minus', '#F44336')}
                {renderSummaryItem('Savings', (`$${summary.savings}`), 'piggy-bank', '#2196F3')}
                {renderSummaryItem('Savings Rate', (`${summary.savingsRate} %`), 'chart-arc', '#FF9800')}
            </View>
            <TouchableOpacity
                onPress={toggleExplanationModal}
                style={styles.footer}
            >
                <MaterialCommunityIcons name="information" size={20} color="#333" />
                <Text style={styles.footerText}>
                    {financialHealthMessage}
                </Text>
            </TouchableOpacity>
            <SavingsRateModal
                visible={explanationModalVisible}
                onClose={toggleExplanationModal}
                savingsRate={summary.savingsRate}
            />
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {},
    summaryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    summaryItem: {
        width: '50%',
        paddingVertical: 12,
        alignItems: 'center',
    },
    iconBackground: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
    },
    summaryAmount: {
        fontSize: 21,
        fontWeight: 'bold',
        color: '#333333',
        marginTop: 4,
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
});