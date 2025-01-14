import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';

const EXPERIENCE_OPTIONS = [
    {
        id: 'beginner',
        title: 'Beginner',
        icon: 'school',
        subtitle: 'Learning the basics'
    },
    {
        id: 'intermediate',
        title: 'Intermediate',
        icon: 'trending-up',
        subtitle: 'Some experience'
    },
    {
        id: 'advanced',
        title: 'Advanced',
        icon: 'account-balance',
        subtitle: 'Comfortable with finances'
    },
    {
        id: 'expert',
        title: 'Expert',
        icon: 'insights',
        subtitle: 'Highly knowledgeable'
    }
];

const SAVING_HABITS = [
    {
        id: 'no_savings',
        title: "Don't save regularly",
        icon: 'money-off'
    },
    {
        id: 'occasional',
        title: 'Save occasionally',
        icon: 'savings'
    },
    {
        id: 'consistent',
        title: 'Save consistently',
        icon: 'track-changes'
    },
    {
        id: 'high',
        title: 'High savings rate',
        icon: 'trending-up'
    },
    {
        id: 'unsure',
        title: "Not sure yet",
        icon: 'help-outline'
    }
];

export default function FinancialContextScreen1({ onNext, onBack }) {
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [selectedSavings, setSelectedSavings] = useState(null);

    const SelectionCard = ({ item, isSelected, onSelect, large = false }) => (
        <TouchableOpacity
            style={[
                styles.card,
                large && styles.cardLarge,
                isSelected && styles.cardSelected
            ]}
            onPress={() => onSelect(item.id)}
        >
            <MaterialIcons
                name={item.icon}
                size={24}
                color={isSelected ? '#EE6567' : '#666666'}
                style={styles.cardIcon}
            />
            <View style={styles.cardContent}>
                <Text style={[
                    styles.cardTitle,
                    isSelected && styles.cardTitleSelected
                ]}>
                    {item.title}
                </Text>
                {item.subtitle && (
                    <Text style={styles.cardSubtitle}>
                        {item.subtitle}
                    </Text>
                )}
            </View>
            {isSelected && (
                <MaterialIcons
                    name="check-circle"
                    size={20}
                    color="#EE6567"
                    style={styles.checkmark}
                />
            )}
        </TouchableOpacity>
    );

    const isNextEnabled = selectedExperience && selectedSavings;

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headline}>Your Financial Profile</Text>
                    <Text style={styles.subheadline}>
                        Help us understand your current financial situation
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        What's your level of financial experience?
                    </Text>
                    <View style={styles.cardsContainer}>
                        {EXPERIENCE_OPTIONS.map(item => (
                            <SelectionCard
                                key={item.id}
                                item={item}
                                isSelected={selectedExperience === item.id}
                                onSelect={setSelectedExperience}
                                large
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        How would you describe your saving habits?
                    </Text>
                    <View style={styles.cardsContainer}>
                        {SAVING_HABITS.map(item => (
                            <SelectionCard
                                key={item.id}
                                item={item}
                                isSelected={selectedSavings === item.id}
                                onSelect={setSelectedSavings}
                            />
                        ))}
                    </View>
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
        marginBottom: 12, // Further reduced
    },
    headline: {
        fontSize: 28, // Reduced from 32
        fontWeight: '700',
        color: '#333333',
        marginBottom: 4, // Reduced from 8
        textAlign: 'center',
    },
    subheadline: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
    },
    section: {
        marginBottom: 12, // Further reduced
    },
    sectionTitle: {
        fontSize: 15, // Reduced from 16
        fontWeight: '600',
        color: '#333333',
        marginBottom: 6, // Further reduced
        lineHeight: 20,
    },
    cardsContainer: {
        gap: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
        padding: 8, // Further reduced
        marginBottom: 4, // Further reduced
        height: 42, // Further reduced
    },
    cardLarge: {
        height: 56, // Further reduced
        paddingVertical: 8, // Further reduced
    },
    cardSelected: {
        borderColor: '#EE6567',
        backgroundColor: '#FFF5F5',
    },
    cardIcon: {
        marginRight: 12,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 13, // Reduced from 14
        fontWeight: '600',
        color: '#333333',
        lineHeight: 16,
    },
    cardTitleSelected: {
        color: '#EE6567',
    },
    cardSubtitle: {
        fontSize: 11, // Reduced from 12
        color: '#666666',
        marginTop: 1, // Reduced from 2
        lineHeight: 14,
    },
    checkmark: {
        marginLeft: 8,
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
    },
    nextButtonDisabled: {
        opacity: 0.5,
    }
});
