import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Button } from '../../common/Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { reset } from 'i18n-js';
import { Input, Icon} from 'react-native-elements';
import { CustomModal } from '../../common/Modal';

export const AddEntryForm = ({ visible, onSubmit, onCancel, categories }) => {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const defaultCategory = categories[0]?.id;
    const [categoryId, setCategoryId] = useState(defaultCategory);
    const selectedCategory = categories.find((category) => category.id === categoryId);

    const handleSubmit = () => {
        onSubmit({ name, amount, date, categoryId });
        resetForm();
    };

    const handleCancel = () => {
        onCancel();
    }

    const resetForm = () => {
        setName('');
        setAmount('');
        setDate(new Date());
        setCategoryId(defaultCategory);
    }


    return (
        <CustomModal 
            title="New Financial Entry"
            visible={visible}
            onClose={handleCancel}
        >
            <View style={styles.container}>
                <Input
                    style={styles.input}
                    placeholder="Entry Name"
                    value={name}
                    onChangeText={setName}
                    maxLength={50}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Amount"
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                />
                <Button 
                    title={date.toLocaleDateString
                    ()}
                    onPress={() => setShowDatePicker(true)}
                    icon={<Icon name="calendar" type="feather" color="#4A90E2" />}
                    buttonStyle={styles.dateButton}
                />

                <View style={styles.buttonContainer}>
                    <Button title="Cancel" onPress={handleCancel} />
                    <Button title="Submit" onPress={handleSubmit} />
                </View>
            </View>
        </CustomModal>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '98%',
        alignItems: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
});
