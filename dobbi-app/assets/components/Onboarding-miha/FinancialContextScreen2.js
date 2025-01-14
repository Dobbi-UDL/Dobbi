import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';

const FINANCIAL_SITUATIONS = [
    {
        id: 'comfortable',
        title: 'Comfortable',
        icon: 'sentiment-very-satisfied',
        subtitle: 'Meeting needs with savings'
    },
    {
        id: 'okay',
        title: 'Okay',
        icon: 'sentiment-satisfied',
        subtitle: 'Managing essentials'
    },
    {
        id: 'need_improvement',
        title: 'Need Improvement',
        icon: 'sentiment-neutral',
        subtitle: 'Some challenges'
    },
    {
        id: 'struggling',
        title: 'Struggling',
        icon: 'sentiment-dissatisfied',
        subtitle: 'Facing difficulties'
    }
];

const DEBT_TYPES = [
    { id: 'credit_cards', title: 'Credit Cards', icon: 'credit-card' },
    { id: 'loans', title: 'Personal Loans', icon: 'account-balance' },
    { id: 'mortgage', title: 'Mortgage', icon: 'home' },
    { id: 'student', title: 'Student Loans', icon: 'school' },
    { id: 'no_debt', title: 'No Debt', icon: 'check-circle' }
];

export default function FinancialContextScreen2({ onNext, onBack }) {
    const [selectedSituation, setSelectedSituation] = useState(null);
    const [selectedDebtTypes, setSelectedDebtTypes] = useState([]);

    const handleDebtSelect = (id) => {
        if (id === 'no_debt') {
            setSelectedDebtTypes(['no_debt']);
            return;
        }
        
        setSelectedDebtTypes(prev => {
            const newSelection = prev.filter(item => item !== 'no_debt');
            if (prev.includes(id)) {
                return newSelection.filter(item => item !== id);
            }
            return [...newSelection, id];
        });
    };

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

    const isNextEnabled = selectedSituation && 
        (selectedDebtTypes.includes('no_debt') || selectedDebtTypes.length > 0);

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headline}>Your Financial Situation</Text>
                    <Text style={styles.subheadline}>
                        This helps us provide relevant suggestions
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        How would you describe your current financial situation?
                    </Text>
                    <View style={styles.cardsContainer}>
                        {FINANCIAL_SITUATIONS.map(item => (
                            <SelectionCard
                                key={item.id}
                                item={item}
                                isSelected={selectedSituation === item.id}
                                onSelect={setSelectedSituation}
                                large
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Do you currently have any debt?
                    </Text>
                    <View style={styles.cardsContainer}>
                        {DEBT_TYPES.map(item => (
                            <SelectionCard
                                key={item.id}
                                item={item}
                                isSelected={selectedDebtTypes.includes(item.id)}
                                onSelect={handleDebtSelect}
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
        padding: 20, // Reduced padding
        paddingTop: 16,
    },
    headerContainer: {
        marginBottom: 12,
    },
    headline: {
        fontSize: 28, // Reduced
        fontWeight: '700',
        color: '#333333',
        marginBottom: 4,
        textAlign: 'center',
    },
    subheadline: {
        fontSize: 18,
        color: '#666666',
        textAlign: 'center',
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 15, // Reduced from 16
        fontWeight: '600',
        color: '#333333',
        marginBottom: 6, // Reduced from 12
        lineHeight: 20,
    },
    cardsContainer: {
        gap: 4, // Further reduced
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
        padding: 8, // Reduced from 12
        marginBottom: 4, // Reduced from 8
        height: 42, // Reduced from 50
    },
    cardLarge: {
        paddingVertical: 8, // Reduced from 16
        height: 56, // Reduced from 70
    },
    cardSelected: {
        borderColor: '#EE6567',
        backgroundColor: '#FFF5F5',
    },
    cardIcon: {
        marginRight: 8, // Reduced from 12
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 13, // Reduced from 14
        fontWeight: '600',
        color: '#333333',
    },
    cardTitleSelected: {
        color: '#EE6567',
    },
    cardSubtitle: {
        fontSize: 11, // Reduced from 12
        color: '#666666',
        marginTop: 1, // Reduced from 2
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
