import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';

const BudgetOverview = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Budget Overview</Text>
            <Card
                title="Total Budget"
                cardStyle={{ marginBottom: 16 }}
                titleStyle={{ color: '#EE6567' }}
            >
                <Text>$1,000</Text>
            </Card>
            <Card
                title="Income"
                >
                <Text>Expenses</Text>
            </Card>
            <Card>
                <Text>Remaining Budget</Text>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF5F6',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default BudgetOverview;