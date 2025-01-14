import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const AnimatedProgressIndicator = ({ currentStep, totalSteps, animationTrigger }) => {
    const dotAnimations = useRef(
        [...Array(totalSteps)].map(() => ({
            width: new Animated.Value(8),
            color: new Animated.Value(0)
        }))
    ).current;

    useEffect(() => {
        // Reset all dots
        const animations = dotAnimations.map((dot, index) => {
            const isActive = index === currentStep - 1;
            return Animated.parallel([
                Animated.spring(dot.width, {
                    toValue: isActive ? 24 : 8,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: false,
                }),
                Animated.timing(dot.color, {
                    toValue: isActive ? 1 : 0,
                    duration: 300,
                    useNativeDriver: false,
                })
            ]);
        });

        Animated.parallel(animations).start();
    }, [currentStep, animationTrigger]);

    return (
        <View style={styles.container}>
            {dotAnimations.map((dot, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.dot,
                        {
                            width: dot.width,
                            backgroundColor: dot.color.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['#FFD1D1', '#EE6567']
                            })
                        }
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 60,
        width: '100%',
        zIndex: 10,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    }
});
