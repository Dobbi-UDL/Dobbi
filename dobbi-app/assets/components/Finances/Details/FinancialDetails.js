import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FinancesOverview = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Financial Details</Text>
            {/* Add your components and logic here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFfFf',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
});

export default FinancesOverview;