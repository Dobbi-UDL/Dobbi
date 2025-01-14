import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SuccessContent } from '../assets/components/SuccessRegister/SuccessContent';

const SuccessScreen = () => {
    const router = useRouter();

    const handleContinue = () => {
        router.replace('/onboarding');
    };

    return (
        <View style={styles.container}>
            <SuccessContent onContinue={handleContinue} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default SuccessScreen;
