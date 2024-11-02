import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../../styles/success';

export const SuccessContent = ({ remainingTime }) => (
    <View style={styles.contentContainer}>
        <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={80} color="#4BB543" />
        </View>
        
        <Text style={styles.title}>Successful Registration!</Text>
        <Text style={styles.subtitle}>Your account has been created successfully</Text>
        
        <Text style={styles.message}>
            Please check your email to activate your account
        </Text>

        <View style={styles.redirectContainer}>
            <ActivityIndicator color="#ff6b6b" style={styles.loader} />
            <Text style={styles.redirectText}>
                Redirecting to login in {remainingTime} seconds...
            </Text>
        </View>
    </View>
);