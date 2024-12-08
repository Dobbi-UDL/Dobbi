import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CustomModal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { reset } from 'i18n-js';

export const EditEntryForm = ({ visible, entry, onUpdate, onDelete, onClose, onRefresh }) => {
    const router = useRouter();
    
    const [entryName, setEntryName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (entry) {
            setEntryName(entry.name || '');
            setAmount(entry.amount != null ? entry.amount.toString() : '');
            setDate(entry.date ? new Date(entry.date) : new Date());
        } else {
            setEntryName('');
            setAmount('');
            setDate(new Date());
        }
    }, [entry]);

    // Validation Form
    const isFormValid = () => {
        return entryName.trim() !== '' && 
               amount.trim() !== '' && 
               !isNaN(parseFloat(amount)) &&
               date instanceof Date && !isNaN(date);
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
    }

    const handleUpdate = async () => {
        if (!isFormValid()) {
            Alert.alert('Incomplete Form', 'Please fill out all fields correctly.');
            return;
        }

        try {
            const updatedEntry = {
                id: entry.id,
                name: entryName.trim(),
                amount: parseFloat(amount),
                date: date,
                category_id: entry.category_id // Preserve the category
            };

            await onUpdate(updatedEntry);

            Alert.alert('Entry Updated', 'The entry has been successfully updated.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetForm();
                            onClose();
                            onRefresh();
                        },
                    },
                ]
            );

        } catch (error) {
            console.error('Error updating entry: ', error);
            Alert.alert('Error Updating Entry', 'An error occurred while updating the entry. Please try again.');
        }
    };

    const handleDeleteButton = () => {
        Alert.alert(
            "Delete Entry",
            "Are you sure you want to delete this entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: () => {
                        handleDelete();
                    },
                    style: "destructive"
                }
            ]
        );
    };
    
    const handleDelete = () => {
        try {
            onDelete(entry.id);

            // If successful, show success message
            Alert.alert('Entry Deleted', 'The entry has been successfully deleted.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetForm();
                            onClose();
                            onRefresh();
                        },
                    },
                ]
            );

        } catch (error) {
            console.error('Error deleting entry: ', error);
            Alert.alert('Error Deleting Entry', 'An error occurred while deleting the entry. Please try again.');
            return;
        }
    };

    const resetForm = () => {
        setEntryName('');
        setAmount('');
        setDate(new Date());
    }

    return (
        <CustomModal
            title="Edit Financial Entry"
            visible={visible}
            onClose={handleClose}
        >
            <View style={styles.container}>
                {/* Entry Name */}
                <View style={styles.section}>
                    <Text style={styles.label}>Entry Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g., Electricity Bill"
                        value={entryName}
                        onChangeText={setEntryName}
                    />
                </View>

                {/* Amount */}
                <View style={styles.section}>
                    <Text style={styles.label}>Amount</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.currencySymbol}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0.00"
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="decimal-pad"
                        />
                    </View>
                </View>

                {/* Date */}
                <View style={styles.section}>
                    <Text style={styles.label}>Date</Text>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={24} color="#EE6567" />
                        <Text style={styles.dateButtonText}>{date.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            firstDayOfWeek={1}
                            onChange={(event, selectedDate) => {
                                setShowDatePicker(false);
                                if (selectedDate) {
                                    setDate(selectedDate);
                                }
                            }}
                            style={styles.datePicker}
                        />
                    )}
                </View>

                {/* Submit Button */}
                <View style={styles.submitButtonContainer}>
                    <Button 
                        title="Delete"
                        onPress={handleDeleteButton}
                        variant="outline"
                        style={styles.deleteButton}
                    />
                    <Button 
                        title="Save"
                        onPress={handleUpdate}
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
        alignSelf: 'center',
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
    segmentedControl: {
        flexDirection: 'row',
        backgroundColor: '#ECECEC',
        borderRadius: 8,
        overflow: 'hidden',
        alignSelf: 'center',
    },
    segmentedButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        alignSelf: 'center',
    },
    segmentedButtonActive: {
        backgroundColor: '#EE6567',
        margin: 4,
        borderRadius: 8,
    },
    segmentedButtonText: {
        fontSize: 16,
        color: '#333',
    },
    segmentedButtonTextActive: {
        color: 'white',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        overflow: 'hidden',
        alignContent: 'center',
        backgroundColor: 'red',
    },
    picker: {
        height: 50,
        backgroundColor: 'white',
        borderWidth: 10,
        borderColor: 'blue',
        overflow: 'hidden',
        padding: 0,
        margin: 0,
        lineHeight: 500,
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
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
    helperText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        minHeight: 56,
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

