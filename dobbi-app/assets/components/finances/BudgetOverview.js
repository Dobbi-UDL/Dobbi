import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BudgetOverview = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Budget Overview</Text>
            {/* Add your components and logic here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default BudgetOverview;