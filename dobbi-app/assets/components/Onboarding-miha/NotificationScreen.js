import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';

const NOTIFICATION_OPTIONS = [
    {
        id: 'expenses',
        title: 'Reminders for tracking expenses',
        icon: 'receipt-long',
        description: 'Get gentle reminders to log your expenses.'
    },
    {
        id: 'goals',
        title: 'Progress updates on saving goals',
        icon: 'trending-up',
        description: 'Stay motivated with updates on your saving progress.'
    },
    {
        id: 'rewards',
        title: 'New deals and rewards in the marketplace',
        icon: 'card-giftcard',
        description: 'Be the first to know about new rewards and offers.'
    },
    {
        id: 'updates',
        title: 'Important updates from the app',
        icon: 'notifications',
        description: 'Stay informed about new features and improvements.'
    },
    {
        id: 'tips',
        title: 'Financial tips and advice from the AI advisor',
        icon: 'lightbulb',
        description: 'Receive personalized financial insights'
    }
];

export default function NotificationScreen({ onNext, onBack, data, onDataUpdate }) {
    const [preferences, setPreferences] = useState(data?.notifications || {});

    useEffect(() => {
        onDataUpdate('notifications', preferences);
    }, [preferences]);

    const toggleNotification = (id) => {
        setPreferences(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const NotificationToggle = ({ option }) => (
        <View style={styles.toggleContainer}>
            <View style={styles.toggleHeader}>
                <MaterialIcons 
                    name={option.icon} 
                    size={20} 
                    color={preferences[option.id] ? '#EE6567' : '#666666'}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <Text style={[
                        styles.toggleTitle,
                        preferences[option.id] && styles.toggleTitleSelected
                    ]}>
                        {option.title}
                    </Text>
                    <Text style={styles.toggleDescription}>{option.description}</Text>
                </View>
                <Switch
                    value={preferences[option.id] || false}
                    onValueChange={() => toggleNotification(option.id)}
                    trackColor={{ false: '#E5E5E5', true: '#FFD4D4' }}
                    thumbColor={preferences[option.id] ? '#EE6567' : '#FFF'}
                    ios_backgroundColor="#E5E5E5"
                />
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headline}>Stay Up to Date</Text>
                    <Text style={styles.subheadline}>
                        Lastly, tell us how you'd like to stay up to date with Dobbi. You can always adjust these later in settings.
                    </Text>
                </View>

                <View style={styles.togglesContainer}>
                    {NOTIFICATION_OPTIONS.map(option => (
                        <NotificationToggle key={option.id} option={option} />
                    ))}
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Back"
                        onPress={onBack}
                        variant="text"
                        style={styles.backButton}
                    />
                    <Button
                        title="Next"
                        onPress={onNext}
                        variant="primary"
                        size="lg"
                        style={styles.nextButton}
                    />
                </View>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: 20,
    },
    headerContainer: {
        marginBottom: 32,
    },
    headline: {
        fontSize: 32,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 8,
        textAlign: 'center',
    },
    subheadline: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
        lineHeight: 24,
    },
    togglesContainer: {
        marginBottom: 24,
    },
    toggleContainer: {
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    toggleHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    icon: {
        marginTop: 2,
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    toggleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 4,
    },
    toggleTitleSelected: {
        color: '#EE6567',
    },
    toggleDescription: {
        fontSize: 14,
        color: '#666666',
        lineHeight: 18,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    backButton: {
        flex: 1,
        marginRight: 12,
    },
    nextButton: {
        flex: 2,
        borderRadius: 24,
        shadowColor: '#d76567',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    }
});