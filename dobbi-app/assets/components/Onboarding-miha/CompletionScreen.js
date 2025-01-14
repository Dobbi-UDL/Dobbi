import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';  // Import the Button component

export default function CompletionScreen({ onComplete }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const buttonScaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.stagger(200, [  // Stagger animations for better flow
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {  // Changed to spring for smoother motion
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // Button animations
    const handlePressIn = () => {
        Animated.spring(buttonScaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(buttonScaleAnim, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return (
        <LinearGradient
            colors={['#FFFFFF', '#FFF5F5']}
            style={styles.container}
        >

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [
                            { translateY: slideAnim },
                            { scale: scaleAnim }
                        ],
                    },
                ]}
            >
                <View style={styles.illustrationContainer}>
                    <Image
                        source={require('../../images/dobbi-heart-top.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                    <View style={styles.decorativeCircle} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.headline}>
                        Thank You!
                    </Text>

                    <Text style={styles.description}>
                        Thank you for completing the onboarding process. You're all set to start exploring Dobbi!
                    </Text>
                </View>

                {/* Button */}
                <Animated.View style={{ transform: [{ scale: buttonScaleAnim }], width: '100%', maxWidth: 280 }}>
                    <Button
                        title="Let's Go!"
                        onPress={onComplete}
                        variant="primary"
                        size="lg"
                        style={styles.button}
                        animated={true}
                        scaleAnim={buttonScaleAnim}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                    />
                </Animated.View>

            </Animated.View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        padding: 24,
        width: '100%',
        maxWidth: 380,
    },
    illustrationContainer: {
        position: 'relative',
        marginBottom: 32, // Match standard spacing
        width: 260,
        height: 260,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: 20, // Adjusted from 60
    },
    decorativeCircle: {
        position: 'absolute',
        width: 286,
        height: 286,
        borderRadius: 143,
        backgroundColor: '#FFE8E8',
        top: -13,
        left: -13,
        zIndex: -1,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32, // Match standard spacing
        width: '100%', // Changed from 340
        maxWidth: 340,
    },
    illustration: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        position: 'relative',
        zIndex: 1,
    },
    headline: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subheadline: {
        fontSize: 20,
        fontWeight: '500',
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
    },
    description: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 26, // Adjusted for better readability
    },
    button: {
        borderRadius: 24,
        shadowColor: '#d76567',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    skipButton: {
        marginTop: 10,
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingVertical: 8,
    },
    privacyNote: {
        fontSize: 12,
        color: '#666666',
        textAlign: 'center',
        marginTop: 16,
    },
    privacyLink: {
        color: '#EE6567',
        textDecorationLine: 'underline',
    }
});