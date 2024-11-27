import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { CustomModal } from '../../common/Modal';
import { Button } from '../../common/Button';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export const AddEntryForm = ({ visible, onClose, onSubmit, categories, userId }) => {
    const [entryType, setEntryType] = useState('expense');
    const [categoryId, setCategoryId] = useState('');
    const [entryName, setEntryName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (categoryId) {
            const category = categories.find(cat => cat.id === categoryId);
            setSelectedCategory(category);
        } else {
            setSelectedCategory(null);
        }
    }, [categoryId, categories]);

    // Filter categories based on entry type
    const filteredCategories = categories.filter(
        (category) => category.type === entryType.toLowerCase()
    );

    // Validation Form
    const isFormValid = () => {
        return (
            categoryId &&
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
    };

    const handleClose = () => {
        resetForm();
        onClose();
    }

    const resetForm = () => {
        setEntryType('expense');
        setCategoryId('');
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
                            onPress={() => setEntryType('expense')}
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
                <TouchableOpacity
                    style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={!isFormValid()}
                >
                    <Text style={styles.submitButtonText}>Add Entry</Text>
                </TouchableOpacity>
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
    submitButton: {
        backgroundColor: '#EE6567',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginTop: 8,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

