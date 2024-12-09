import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CustomModal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Ionicons } from '@expo/vector-icons';

export const AddEntryForm = ({ visible, onClose, onSubmit, userId, categories, preselectedCategory, onRefresh }) => {
    const [entryType, setEntryType] = useState('expense'); // Default to expense
    const [categoryId, setCategoryId] = useState('0');
    const [entryName, setEntryName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (visible) {  // Only reset when modal becomes visible
            if (preselectedCategory && preselectedCategory.type) {
                setEntryType(preselectedCategory.type);
                setCategoryId(preselectedCategory.id || '0');
            } else {
                setEntryType('expense');
                setCategoryId('0');
            }
            // Reset other form fields
            setEntryName('');
            setAmount('');
            setDate(new Date());
        }
    }, [preselectedCategory, visible]);

    // Filter categories based on entry type
    const filteredCategories = categories.filter(
        (category) => category.type === entryType.toLowerCase()
    );

    // Validation Form
    const isFormValid = () => {
        return (
            categoryId &&
            categoryId !== '0' &&
            entryName.trim() !== '' &&
            amount.trim() !== '' &&
            parseFloat(amount) > 0
        );
    };

    const handleSubmit = () => {
        if (!isFormValid()) {
            Alert.alert('Incomplete Form', 'Please fill out all fields correctly.');
            return;
        }

        const newEntry = {
            user_id: userId,
            category_id: categoryId,
            name: entryName,
            amount: parseFloat(amount),
            date: date,
        };

        onSubmit(newEntry);
        resetForm();
        onClose();
        onRefresh();
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

    const resetForm = () => {
        setEntryType('expense');
        setCategoryId('0');
        setEntryName('');
        setAmount('');
        setDate(new Date());
    }

    return (
        <CustomModal
            title="New Financial Entry"
            visible={visible}
            onClose={handleClose}
            onSubmit={handleSubmit}
        >
            <View style={styles.container}>
                {/* Select Entry Type */}
                <View style={styles.section}>
                    <Text style={styles.label}>Entry Type</Text>
                    <View style={styles.segmentedControl}>
                        <TouchableOpacity
                            style={[
                                styles.segmentedButton,
                                entryType === 'income' && styles.segmentedButtonActive
                            ]}
                            onPress={() => {
                                setEntryType('income');
                                setCategoryId('0');
                                setSelectedCategory(null);
                            }}
                        >
                            <Text style={[
                                styles.segmentedButtonText,
                                entryType === 'income' && styles.segmentedButtonTextActive
                            ]}>Income</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.segmentedButton,
                                entryType === 'expense' && styles.segmentedButtonActive
                            ]}
                            onPress={() => {
                                setEntryType('expense');
                                setCategoryId('0');
                                setSelectedCategory(null);
                            }}
                        >
                            <Text style={[
                                styles.segmentedButtonText,
                                entryType === 'expense' && styles.segmentedButtonTextActive
                            ]}>Expense</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Select Category */}
                <View style={styles.section}>
                    <Text style={styles.label}>Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={categoryId}
                            onValueChange={(value) => {
                                setCategoryId(value)
                                console.log(value)
                            }}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a category" value="0" />
                            {filteredCategories.map((category) => (
                                <Picker.Item
                                    key={category.id}
                                    label={category.name}
                                    value={category.id}
                                />
                            ))}
                        </Picker>
                    </View>
                    {selectedCategory && selectedCategory.description ? (
                        <Text style={styles.helperText}>{selectedCategory.description || 'No description'}
                        </Text>
                    ) : (
                        <Text style={styles.helperText}>Choose a category to see its description</Text>
                    )}
                    
                </View>

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
                        title="Cancel"
                        onPress={handleClose}
                        variant="outline"
                        style={styles.deleteButton}
                    />
                    <Button 
                        title="Add Entry"
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
        alignSelf: 'center',
    },
    section: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333333',
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
        color: '#333333',
        fontWeight: '500',
    },
    segmentedButtonTextActive: {
        color: '#FFFFFF',
        fontWeight: '500',
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
        color: '#333333',
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
        color: '#333333',
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
        color: '#333333',
    },
    datePicker: {
        backgroundColor: 'white',
    },
    helperText: {
        fontSize: 14,
        color: '#555555',
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

