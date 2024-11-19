import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ onPress, title, variant = 'primary', size = 'md', style }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.button,
                styles[variant],
                styles[size],
                style
            ]}
        >
            <Text style={[
                styles.text,
                variant === 'outline' && styles.outlineText,
                size === 'sm' && styles.smallText
            ]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primary: {
        backgroundColor: '#EE6567',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#EE6567',
    },
    sm: {
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    md: {
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    lg: {
        paddingVertical: 14,
        paddingHorizontal: 20,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    outlineText: {
        color: '#EE6567',
    },
    smallText: {
        fontSize: 14,
    },
});

export default Button;
