import React from 'react';
import { View, StyleSheet } from 'react-native';

export function ProgressIndicator({ currentStep, totalSteps }) {
    return (
        <View style={styles.container}>
            {Array.from({ length: totalSteps }).map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        index < currentStep ? styles.activeDot : styles.inactiveDot,
                    ]}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#EE6567',
    },
    inactiveDot: {
        backgroundColor: '#ECECEC',
    },
});

