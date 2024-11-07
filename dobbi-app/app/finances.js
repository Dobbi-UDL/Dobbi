import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Finances = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is the Finances screen</Text>
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