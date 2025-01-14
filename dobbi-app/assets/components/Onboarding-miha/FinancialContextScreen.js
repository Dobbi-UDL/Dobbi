import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../common/Button';

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
        { id: 'student', title: 'Student Loans', icon: 'school' }
    ]
};

export default function FinancialContextScreen({ onNext, onBack }) {
    const [selections, setSelections] = useState({
        experience: null,
        savings: null,
        situation: null,
        debt: []
    });
    const [openDropdown, setOpenDropdown] = useState(null);

    const toggleDropdown = (dropdownName) => {
        setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    };

    const handleSelect = (type, id) => {
        setSelections(prev => ({
            ...prev,
            [type]: type === 'debt' 
                ? handleDebtSelection(prev.debt, id)
                : id
        }));
    };

    const handleDebtSelection = (prevSelection, id) => {
        if (id === 'no_debt') return ['no_debt'];
        const newSelection = prevSelection.filter(item => item !== 'no_debt');
        return newSelection.includes(id)
            ? newSelection.filter(item => item !== id)
            : [...newSelection, id];
    };

    const DropdownItem = ({ item, selected, onSelect }) => (
        <TouchableOpacity
            style={[styles.dropdownItem, selected && styles.dropdownItemSelected]}
            onPress={() => onSelect(item.id)}
        >
            <MaterialIcons
                name={item.icon}
                size={20}
                color={selected ? '#EE6567' : '#666666'}
            />
            <Text style={[styles.dropdownItemText, selected && styles.dropdownItemTextSelected]}>
                {item.title}
            </Text>
            {selected && (
                <MaterialIcons name="check" size={20} color="#EE6567" />
            )}
        </TouchableOpacity>
    );

    const isValid = selections.experience && selections.savings && 
                   selections.situation && selections.debt.length > 0;

    return (
        <LinearGradient colors={['#FFFFFF', '#FFF5F5']} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headline}>Financial Profile</Text>
                    <Text style={styles.subheadline}>Help us understand your situation</Text>
                </View>

                {/* Experience Dropdown */}
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={styles.dropdownHeader}
                        onPress={() => toggleDropdown('experience')}
                    >
                        <View style={styles.dropdownHeaderContent}>
                            <Text style={styles.dropdownLabel}>Financial Experience</Text>
                            <Text style={styles.dropdownValue}>
                                {selections.experience 
                                    ? OPTIONS.experience.find(i => i.id === selections.experience)?.title 
                                    : 'Select level'}
                            </Text>
                        </View>
                        <MaterialIcons
                            name={openDropdown === 'experience' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                            size={24}
                            color="#666666"
                        />
                    </TouchableOpacity>
                    {openDropdown === 'experience' && (
                        <View style={styles.dropdownList}>
                            {OPTIONS.experience.map(item => (
                                <DropdownItem
                                    key={item.id}
                                    item={item}
                                    selected={selections.experience === item.id}
                                    onSelect={(id) => handleSelect('experience', id)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Savings Dropdown */}
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={styles.dropdownHeader}
                        onPress={() => toggleDropdown('savings')}
                    >
                        <View style={styles.dropdownHeaderContent}>
                            <Text style={styles.dropdownLabel}>Saving Habits</Text>
                            <Text style={styles.dropdownValue}>
                                {selections.savings 
                                    ? OPTIONS.savings.find(i => i.id === selections.savings)?.title 
                                    : 'Select habits'}
                            </Text>
                        </View>
                        <MaterialIcons
                            name={openDropdown === 'savings' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                            size={24}
                            color="#666666"
                        />
                    </TouchableOpacity>
                    {openDropdown === 'savings' && (
                        <View style={styles.dropdownList}>
                            {OPTIONS.savings.map(item => (
                                <DropdownItem
                                    key={item.id}
                                    item={item}
                                    selected={selections.savings === item.id}
                                    onSelect={(id) => handleSelect('savings', id)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Financial Situation Dropdown */}
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={styles.dropdownHeader}
                        onPress={() => toggleDropdown('situation')}
                    >
                        <View style={styles.dropdownHeaderContent}>
                            <Text style={styles.dropdownLabel}>Current Financial Situation</Text>
                            <Text style={styles.dropdownValue}>
                                {selections.situation 
                                    ? OPTIONS.situation.find(i => i.id === selections.situation)?.title 
                                    : 'Select situation'}
                            </Text>
                        </View>
                        <MaterialIcons
                            name={openDropdown === 'situation' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                            size={24}
                            color="#666666"
                        />
                    </TouchableOpacity>
                    {openDropdown === 'situation' && (
                        <View style={styles.dropdownList}>
                            {OPTIONS.situation.map(item => (
                                <DropdownItem
                                    key={item.id}
                                    item={item}
                                    selected={selections.situation === item.id}
                                    onSelect={(id) => handleSelect('situation', id)}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Debt Dropdown (Multiple Selection) */}
                <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                        style={styles.dropdownHeader}
                        onPress={() => toggleDropdown('debt')}
                    >
                        <View style={styles.dropdownHeaderContent}>
                            <Text style={styles.dropdownLabel}>Current Debt</Text>
                            <Text style={styles.dropdownValue}>
                                {selections.debt.length > 0
                                    ? `${selections.debt.length} selected`
                                    : 'Select debt types'}
                            </Text>
                        </View>
                        <MaterialIcons
                            name={openDropdown === 'debt' ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                            size={24}
                            color="#666666"
                        />
                    </TouchableOpacity>
                    {openDropdown === 'debt' && (
                        <View style={styles.dropdownList}>
                            {OPTIONS.debt.map(item => (
                                <DropdownItem
                                    key={item.id}
                                    item={item}
                                    selected={selections.debt.includes(item.id)}
                                    onSelect={(id) => handleSelect('debt', id)}
                                />
                            ))}
                        </View>
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
    dropdownContainer: {
        marginBottom: 16,
    },
    dropdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
    },
    dropdownHeaderContent: {
        flex: 1,
    },
    dropdownLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 2,
    },
    dropdownValue: {
        fontSize: 16,
        color: '#333333',
        fontWeight: '500',
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
    }
});