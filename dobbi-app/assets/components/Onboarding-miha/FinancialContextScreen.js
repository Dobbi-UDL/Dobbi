import React, { useState, useEffect, useCallback, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';
import { CustomPicker } from '../common/CustomPicker';

const OPTIONS = {
    experience: [
        { id: 'beginner', title: 'Beginner', icon: 'school' },
        { id: 'intermediate', title: 'Intermediate', icon: 'trending-up' },
        { id: 'advanced', title: 'Advanced', icon: 'account-balance' },
        { id: 'expert', title: 'Expert', icon: 'insights' }
    ],
    savings: [
        { id: 'no_savings', title: "Don't save regularly", icon: 'money-off' },
        { id: 'occasional', title: 'Save occasionally', icon: 'savings' },
        { id: 'consistent', title: 'Save consistently', icon: 'track-changes' },
        { id: 'high', title: 'High savings rate', icon: 'trending-up' }
    ],
    situation: [
        { id: 'comfortable', title: 'Comfortable', icon: 'sentiment-very-satisfied' },
        { id: 'okay', title: 'Okay', icon: 'sentiment-satisfied' },
        { id: 'need_improvement', title: 'Need Improvement', icon: 'sentiment-neutral' },
        { id: 'struggling', title: 'Struggling', icon: 'sentiment-dissatisfied' }
    ],
    debt: [
        { id: 'no_debt', title: 'No Debt', icon: 'check-circle' },
        { id: 'credit_cards', title: 'Credit Cards', icon: 'credit-card' },
        { id: 'loans', title: 'Personal Loans', icon: 'account-balance' },
        { id: 'mortgage', title: 'Mortgage', icon: 'home' },
        { id: 'student', title: 'Student Loans', icon: 'school' },
        { id: 'other', title: 'Other', icon: 'more-horiz' }
    ]
};

export default function FinancialContextScreen({ onNext, onBack, data, onDataUpdate }) {
    const [selections, setSelections] = useState({
        experience: data.experience,
        savings: data.savings,
        situation: data.situation,
        debtTypes: data.debtTypes,
        otherDebt: data.otherDebt
    });

    // Update parent state when selections change
    useEffect(() => {
        onDataUpdate('financial', selections);
    }, [selections]);

    const handleDebtSelect = useCallback((id) => {
        setSelections(prev => ({
            ...prev,
            debtTypes: prev.debtTypes.includes(id)
                ? prev.debtTypes.filter(item => item !== id)
                : [...prev.debtTypes, id]
        }));
    }, []);

    const SelectionCard = memo(({ item, isSelected }) => (
        <TouchableOpacity
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => handleDebtSelect(item.id)}
        >
            <MaterialIcons
                name={item.icon}
                size={20}
                color={isSelected ? '#EE6567' : '#666666'}
            />
            <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                {item.title}
            </Text>
            {isSelected && (
                <View style={styles.checkmark}>
                    <MaterialIcons name="check-circle" size={16} color="#EE6567" />
                </View>
            )}
        </TouchableOpacity>
    ));

    const isValid = selections.experience && selections.savings && 
                   selections.situation && selections.debtTypes.length > 0;

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headline}>Financial Profile</Text>
                    <Text style={styles.subheadline}>Help us understand your situation</Text>
                </View>

                <View style={styles.formContainer}>
                    {/* Financial Experience */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>What's your level of financial experience?</Text>
                        <CustomPicker
                            placeholder="Select experience level"
                            value={selections.experience}
                            onSelect={(option) => setSelections(prev => ({ ...prev, experience: option.value }))}
                            options={OPTIONS.experience.map(item => ({
                                value: item.id,
                                label: item.title,
                                icon: item.icon
                            }))}
                            defaultIcon="school"
                        />
                    </View>

                    {/* Saving Habits */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>How would you describe your saving habits?</Text>
                        <CustomPicker
                            placeholder="Select saving habits"
                            value={selections.savings}
                            onSelect={(option) => setSelections(prev => ({ ...prev, savings: option.value }))}
                            options={OPTIONS.savings.map(item => ({
                                value: item.id,
                                label: item.title,
                                icon: item.icon
                            }))}
                            defaultIcon="savings"
                        />
                    </View>

                    {/* Financial Situation */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>What's your current financial situation?</Text>
                        <CustomPicker
                            placeholder="Select financial situation"
                            value={selections.situation}
                            onSelect={(option) => setSelections(prev => ({ ...prev, situation: option.value }))}
                            options={OPTIONS.situation.map(item => ({
                                value: item.id,
                                label: item.title,
                                icon: item.icon
                            }))}
                            defaultIcon="sentiment-very-satisfied"
                        />
                    </View>

                    {/* Debt Types */}
                    <View style={[styles.inputGroup, { marginTop: 24 }]}>
                        <Text style={styles.label}>Do you currently have any debt?</Text>
                        <Text style={styles.subtitle}>(Select all that apply)</Text>
                        <View style={styles.cardsContainer}>
                            {OPTIONS.debt.map(item => (
                                <SelectionCard
                                    key={item.id}
                                    item={item}
                                    isSelected={selections.debtTypes.includes(item.id)}
                                />
                            ))}
                        </View>
                        {selections.debtTypes.includes('other') && (
                            <TextInput
                                style={styles.otherInput}
                                placeholder="Specify other debt type..."
                                value={selections.otherDebt}
                                onChangeText={(text) => setSelections(prev => ({
                                    ...prev,
                                    otherDebt: text
                                }))}
                            />
                        )}
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
                        style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
                        disabled={!isValid}
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
        padding: 20,
        paddingTop: 16,
    },
    headerContainer: {
        marginBottom: 24,
    },
    headline: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333333',
        marginBottom: 4,
        textAlign: 'center',
    },
    subheadline: {
        fontSize: 16,
        color: '#666666',
        textAlign: 'center',
    },
    formContainer: {
        marginBottom: 24,
    },
    inputGroup: {
        marginBottom: 2, // Reduced from 20 to 16
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    pickerContainer: {
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        height: 50,
    },
    pickerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: '100%',
    },
    iconLeft: {
        marginRight: 12,
    },
    selectedText: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
    },
    placeholderText: {
        flex: 1,
        fontSize: 16,
        color: '#999999',
    },
    dropdownList: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginTop: 4,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        maxHeight: 200,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    dropdownItemSelected: {
        backgroundColor: '#FFF5F5',
    },
    dropdownItemText: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
        marginLeft: 12,
    },
    dropdownItemTextSelected: {
        color: '#EE6567',
        fontWeight: '500',
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
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
        marginTop: -4, // Tighter coupling with main label
    },
    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48.5%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12, // Match common border radius
        padding: 14, // Increased from 12
        marginBottom: 8, // Increased from 8
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
        fontSize: 14,
        color: '#666666',
        marginLeft: 10,
        flex: 1,
    },
    cardTextSelected: {
        color: '#EE6567',
        fontWeight: '600',
    },
    checkmark: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
    },
    otherInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
        padding: 14,
        marginTop: 8,
        fontSize: 14,
        height: 52.5,
    },
});