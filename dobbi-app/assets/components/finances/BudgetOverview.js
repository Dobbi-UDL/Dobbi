import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Card from '../common/Card';

const BudgetOverview = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Budget Overview</Text>
            <Card>
                <Text>Here you can see an overview of your budget.</Text>
            </Card>
            <Card>
                <Text>Here you can see an overview of your budget.</Text>
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
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default BudgetOverview;