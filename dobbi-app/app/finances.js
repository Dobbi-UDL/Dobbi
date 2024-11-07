import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BudgetOverview  from '../assets/components/finances/BudgetOverview';
import FinancialDetails from '../assets/components/finances/FinancialDetails';

const Finances = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is the Finances screen</Text>
            <BudgetOverview />
            <FinancialDetails />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        borderWidth: 10,
        borderColor: 'red',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default Finances;