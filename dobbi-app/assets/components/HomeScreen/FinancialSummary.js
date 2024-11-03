import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/financialSummary';

export const FinancialSummary = () => {
  // Datos de ejemplo
  const summaryData = {
    totalBalance: 5420.50,
    monthlyExpenses: 1234.67,
    savingsGoal: 10000,
    savingsProgress: 3500,
    recentTransactions: [
      { id: 1, title: 'Grocery Shopping', amount: -89.50, date: '2024-03-01' },
      { id: 2, title: 'Salary Deposit', amount: 2500.00, date: '2024-02-28' },
      { id: 3, title: 'Netflix Subscription', amount: -15.99, date: '2024-02-27' },
    ]
  };

return (
    <View style={styles.container}>
        {/* Balance Card */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Current Balance</Text>
            <Text style={styles.balanceText}>
                {summaryData.totalBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </Text>
        </View>

        {/* Monthly Overview */}
        <View style={styles.row}>
            <View style={[styles.card, styles.halfCard]}>
                <View style={styles.iconContainer}>
                    <Icon name="cash-minus" size={24} color="#ff6b6b" />
                </View>
                <Text style={styles.cardSubtitle}>Monthly Expenses</Text>
                <Text style={styles.amountText}>
                    {summaryData.monthlyExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </Text>
            </View>
            
            <View style={[styles.card, styles.halfCard]}>
                <View style={styles.iconContainer}>
                    <Icon name="piggy-bank" size={24} color="#ff6b6b" />
                </View>
                <Text style={styles.cardSubtitle}>Savings Goal</Text>
                <Text style={styles.amountText}>
                    {summaryData.savingsGoal.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                </Text>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { width: `${(summaryData.savingsProgress / summaryData.savingsGoal) * 100}%` }
                        ]} 
                    />
                </View>
            </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Transactions</Text>
            {summaryData.recentTransactions.map(transaction => (
                <View key={transaction.id} style={styles.transactionItem}>
                    <View style={styles.transactionInfo}>
                        <Text style={styles.transactionTitle}>{transaction.title}</Text>
                        <Text style={styles.transactionDate}>{transaction.date}</Text>
                    </View>
                    <Text style={[
                        styles.transactionAmount,
                        { color: transaction.amount >= 0 ? '#4CAF50' : '#FF5252' }
                    ]}>
                        {Math.abs(transaction.amount).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </Text>
                </View>
            ))}
        </View>
    </View>
);
};