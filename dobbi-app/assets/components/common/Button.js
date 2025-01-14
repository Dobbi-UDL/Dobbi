import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';

export const Button = ({ 
    onPress, 
    title, 
    variant = 'primary', 
    size = 'md', 
    style,
    animated = false,
    scaleAnim,
    onPressIn,
    onPressOut
}) => {
    const ButtonContainer = animated ? Animated.createAnimatedComponent(TouchableOpacity) : TouchableOpacity;

    return (
        <ButtonContainer
            onPress={onPress}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[
                styles.button,
                styles[variant],
                styles[size],
                style,
                animated && { transform: [{ scale: scaleAnim }] }
            ]}
            activeOpacity={0.9}
        >
            <Text style={[
                styles.text,
                variant === 'outline' && styles.outlineText,
                variant === 'text' && styles.textVariantText,
                size === 'sm' && styles.smallText
            ]}>
                {title}
            </Text>
        </ButtonContainer>
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
    textVariantText: {
        color: '#666666',
        textDecorationLine: 'underline',
        fontSize: 14,
        fontWeight: '400', // Regular font weight instead of bold
    },
});
