import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export const NumberInput = ({ value, onChangeText, placeholder }) => {
    const handleChangeText = (text) => {
        // Remove any non-digit or non-decimal point characters
        const cleanedText = text.replace(/[^0-9.]/g, '');

        // Ensure only one decimal point
        const parts = cleanedText.split('.');
        if (parts.length > 2) {
            parts.pop();
        }

        // Limit to two decimal places
        if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].substring(0, 2);
        }

        const formattedText = parts.join('.');
        onChangeText(formattedText);
    };

    return (
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            keyboardType="decimal-pad"
        />
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
    },
});

