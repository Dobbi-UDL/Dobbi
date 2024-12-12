import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { CustomModal } from '../common/Modal';
import { Button } from '../common/Button';
import { supabase } from '../../../config/supabaseClient';

export const AddGoalForm = ({ 
    visible, 
    onClose, 
    userId, 
    onGoalCreated 
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetAmount, setTargetAmount] = useState('');
    const [monthlySaving, setMonthlySaving] = useState('');
    const [expiringDate, setExpiringDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Validation Form
    const isFormValid = () => {
        return (
            title.trim() !== '' &&
            description.trim() !== '' &&
            parseFloat(targetAmount) > 0 &&
            parseFloat(monthlySaving) > 0
        );
    };

    const handleSubmit = async () => {
        if (!isFormValid()) {
            Alert.alert('Incomplete Form', 'Please fill out all fields correctly.');
            return;
        }

        try {
            // Insert saving goal
            const { data: goalData, error: goalError } = await supabase
                .from('saving_goals')
                .insert({
                    creator_id: userId,
                    title: title,
                    description: description,
                    target_amount: parseFloat(targetAmount),
                    monthly_saving: parseFloat(monthlySaving),
                    expiring_date: expiringDate.toISOString(),
                    is_sponsored: false, // Default to false
                })
                .select()
                .single();

            if (goalError) throw goalError;

            // Create goal tracking entry
            const { error: trackingError } = await supabase
                .from('goal_tracking')
                .insert({
                    user_id: userId,
                    goal_id: goalData.id,
                    current_amount: 0,
                    start_date: new Date().toISOString(),
                    end_date: expiringDate.toISOString(),
                    monthly_saving: parseFloat(monthlySaving),
                    target_amount: parseFloat(targetAmount),
                    completed: false,
                    goal_status: 'working'
                });

            if (trackingError) throw trackingError;

            // Notify parent component
            onGoalCreated();
            
            // Reset form and close
            resetForm();
            onClose();

            Alert.alert('Success', 'Your saving goal has been created!');
        } catch (error) {
            console.error('Error creating saving goal:', error);
            Alert.alert('Error', 'Failed to create saving goal. Please try again.');
        }
    };

    const handleClose = () => {
        Alert.alert(
            'Are you sure?',
            'You will lose any unsaved changes.',
            [
                {
                    text: 'No',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        resetForm();
                        onClose();
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setTargetAmount('');
        setMonthlySaving('');
        setExpiringDate(new Date());
    };

    return (
        <CustomModal
            title="Create Saving Goal"
            visible={visible}
            onClose={handleClose}
            onSubmit={handleSubmit}
        >
            <View style={styles.container}>
                {/* Title */}
                <View style={styles.section}>
                    <Text style={styles.label}>Goal Title</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., New Laptop Fund"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.multilineInput]}
                        placeholder="Describe your saving goal"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                {/* Target Amount */}
                <View style={styles.section}>
                    <Text style={styles.label}>Target Amount</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            value={targetAmount}
                            onChangeText={setTargetAmount}
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                {/* Monthly Saving */}
                <View style={styles.section}>
                    <Text style={styles.label}>Monthly Saving</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            value={monthlySaving}
                            onChangeText={setMonthlySaving}
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                {/* Expiring Date */}
                <View style={styles.section}>
                    <Text style={styles.label}>Target Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={24} color="#EE6567" />
                        <Text style={styles.dateButtonText}>{expiringDate.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={expiringDate}
                            mode="date"
                            display="default"
                            firstDayOfWeek={1}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setExpiringDate(selectedDate);
                                }
                            }}
                            style={styles.datePicker}
                        />
                    )}
                </View>

                {/* Submit Buttons */}
                <View style={styles.submitButtonContainer}>
                    <Button 
                        title="Cancel"
                        onPress={handleClose}
                        variant="outline"
                        style={styles.deleteButton}
                    />
                    <Button 
                        title="Create Goal"
                        onPress={handleSubmit}
                        disabled={!isFormValid()}
                        style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
                    />
                </View>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '95%',
        marginTop: 16,
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    multilineInput: {
        height: 100,
        textAlignVertical: 'top',
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        overflow: 'hidden',
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 12,
        color: '#333',
    },
    amountInput: {
        flex: 1,
        padding: 12,
        fontSize: 16,
    },
    dateButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        padding: 12,
    },
    dateButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    datePicker: {
        backgroundColor: 'white',
    },
    submitButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center',
    },
    submitButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 8,
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 8,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    deleteButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 8,
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 8,
    },
});