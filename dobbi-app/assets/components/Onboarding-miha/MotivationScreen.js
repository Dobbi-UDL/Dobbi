import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';

const MOTIVATIONS = [
    { id: 'track', title: 'Track my spending', icon: 'account-balance-wallet' },
    { id: 'budget', title: 'Create a budget', icon: 'pie-chart' },
    { id: 'save', title: 'Save for specific goals', icon: 'savings' },
    { id: 'rewards', title: 'Redeem rewards and deals', icon: 'card-giftcard' },
    { id: 'advice', title: 'Get financial advice', icon: 'trending-up' },
    { id: 'other', title: 'Other', icon: 'more-horiz' }
];

const GOALS = [
    { id: 'house', title: 'Buying a house', icon: 'home' },
    { id: 'debt', title: 'Paying off debt', icon: 'money-off' },
    { id: 'retirement', title: 'Saving for retirement', icon: 'beach-access' },
    { id: 'travel', title: 'Travel', icon: 'flight' },
    { id: 'investing', title: 'Investing', icon: 'show-chart' },
    { id: 'other', title: 'Other', icon: 'more-horiz' }
];

export default function MotivationScreen({ onNext, onBack, currentStep = 4, totalSteps = 6 }) {
    const [selectedMotivations, setSelectedMotivations] = useState([]);
    const [selectedGoals, setSelectedGoals] = useState([]);
    const [otherMotivation, setOtherMotivation] = useState('');
    const [otherGoal, setOtherGoal] = useState('');

    const handleMotivationSelect = (id) => {
        setSelectedMotivations(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, id];
        });
    };

    const handleGoalSelect = (id) => {
        setSelectedGoals(prev => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            }
            if (prev.length >= 3) {
                return prev;
            }
            return [...prev, id];
        });
    };

    const isNextEnabled = selectedMotivations.length > 0 && selectedGoals.length > 0;

    const SelectionCard = ({ item, isSelected, onSelect, type }) => (
        <TouchableOpacity
            style={[
                styles.card,
                isSelected && styles.cardSelected
            ]}
            onPress={() => onSelect(item.id)}
        >
            <MaterialIcons
                name={item.icon}
                size={20}
                color={isSelected ? '#EE6567' : '#666666'}
            />
            <Text style={[
                styles.cardText,
                isSelected && styles.cardTextSelected
            ]}>
                {item.title}
            </Text>
            {isSelected && (
                <View style={styles.checkmark}>
                    <MaterialIcons name="check-circle" size={16} color="#EE6567" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headline}>Your Financial Journey</Text>
                        <Text style={styles.subheadline}>
                            Tell us what brings you here today
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            What's your primary reason for using Dobbi?
                            <Text style={styles.subtitle}> (Select up to 3)</Text>
                        </Text>
                        <View style={styles.cardsContainer}>
                            {MOTIVATIONS.map(item => (
                                <SelectionCard
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedMotivations.includes(item.id)}
                                    onSelect={handleMotivationSelect}
                                    type="motivation"
                                />
                            ))}
                        </View>
                        {selectedMotivations.includes('other') && (
                            <TextInput
                                style={styles.otherInput}
                                placeholder="Tell us more..."
                                value={otherMotivation}
                                onChangeText={setOtherMotivation}
                            />
                        )}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            What are your financial goals?
                            <Text style={styles.subtitle}> (Select up to 3)</Text>
                        </Text>
                        <View style={styles.cardsContainer}>
                            {GOALS.map(item => (
                                <SelectionCard
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedGoals.includes(item.id)}
                                    onSelect={handleGoalSelect}
                                    type="goal"
                                />
                            ))}
                        </View>
                        {selectedGoals.includes('other') && (
                            <TextInput
                                style={styles.otherInput}
                                placeholder="Tell us more..."
                                value={otherGoal}
                                onChangeText={setOtherGoal}
                            />
                        )}
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
                            style={[
                                styles.nextButton,
                                !isNextEnabled && styles.nextButtonDisabled
                            ]}
                            disabled={!isNextEnabled}
                        />
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
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
    },
    section: {
        marginBottom: 24, // Match standard spacing
    },
    sectionTitle: {
        fontSize: 16, // Match standard label size
        fontWeight: '600',
        color: '#333333',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 14, // Increased from 13
        color: '#666666',
        fontWeight: '400',
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginHorizontal: -4, // Add negative margin to offset card padding
    },
    card: {
        width: '48.5%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // Match common border radius
        padding: 14, // Increased from 12
        marginBottom: 12, // Increased from 8
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5, // Reduced from 2
        borderColor: '#E5E5E5',
        position: 'relative',
        height: 50, // Match standard input height
    },
    cardSelected: {
        borderColor: '#EE6567',
        backgroundColor: '#FFF5F5',
    },
    cardText: {
        fontSize: 14, // Increased from 13
        color: '#666666',
        marginLeft: 10, // Increased from 8
        flex: 1,
    },
    cardTextSelected: {
        color: '#EE6567',
        fontWeight: '600',
    },
    checkmark: {
        position: 'absolute',
        top: -8, // Adjusted from -10
        right: -8, // Adjusted from -10
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    otherInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // Match common border radius
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 10, // Reduced from 12
        marginTop: 8,
        fontSize: 14, // Reduced from 16
        height: 50, // Match standard input height
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
        paddingTop: 12, // Reduced from 16
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
    },
    nextButtonDisabled: {
        opacity: 0.5,
    },
});
