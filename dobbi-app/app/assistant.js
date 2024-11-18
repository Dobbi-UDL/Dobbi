import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../assets/components/Header/Header';
import { BottomNavBar } from '../assets/components/Navigation/BottomNavBar';

const HelloPage = () => {
    return (
        <>
        <Header />
        <View style={styles.container}>
            <Text style={styles.text}>Hello, welcome to Dobbi App!</Text>
        </View>
        <BottomNavBar />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

export default HelloPage;