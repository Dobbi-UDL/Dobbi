import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';

export const SuccessContent = ({ onContinue }) => (
    <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
        <View style={styles.content}>
            <View style={styles.illustrationContainer}>
                <Image
                    source={require('../../images/dobbi-heart-top.png')}
                    style={styles.illustration}
                    resizeMode="contain"
                />
                <View style={styles.decorativeCircle} />
            </View>

            <View style={styles.textContainer}>
                <MaterialIcons
                    name="check-circle"
                    size={48}
                    color="#4BB543"
                    style={styles.checkIcon}
                />
                <Text style={styles.title}>Account Created!</Text>
                <Text style={styles.message}>
                    Great! Your account is ready. Next, we'll help you personalize your experience.
                </Text>
            </View>

            <Button
                title="Start Personalization"
                onPress={onContinue}
                variant="primary"
                size="lg"
                style={styles.button}
            />
        </View>
    </LinearGradient>
);

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
        marginBottom: 32,
        width: 260,
        height: 260,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
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
    illustration: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        position: 'relative',
        zIndex: 1,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
        width: '100%',
        maxWidth: 340,
    },
    checkIcon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333333',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    message: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 26,
    },
    button: {
        width: '100%',
        maxWidth: 280,
        borderRadius: 24,
        shadowColor: '#d76567',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
});