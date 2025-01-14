import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

export const DatePicker = ({ 
    label,
    value,
    onChange,
    placeholder = "Select date",
    maximumDate = new Date(),
    minimumDate = new Date(1900, 0, 1)
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempDate, setTempDate] = useState(value || new Date());

    const handleConfirm = () => {
        onChange(tempDate);
        setIsOpen(false);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) return '';
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} years old`;
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity 
                style={[
                    styles.pickerContainer,
                    value && styles.pickerContainerSelected
                ]}
                onPress={() => setIsOpen(true)}
            >
                <View style={styles.pickerContent}>
                    <MaterialIcons
                        name="cake"
                        size={20}
                        color={value ? '#EE6567' : '#666666'}
                        style={styles.iconLeft}
                    />
                    <View style={styles.textContainer}>
                        <Text style={value ? styles.selectedText : styles.placeholderText}>
                            {value ? formatDate(value) : placeholder}
                        </Text>
                        {value && (
                            <Text style={styles.ageText}>
                                {calculateAge(value)}
                            </Text>
                        )}
                    </View>
                    <MaterialIcons
                        name="arrow-drop-down"
                        size={24}
                        color="#666666"
                    />
                </View>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <TouchableOpacity 
                                onPress={() => setIsOpen(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeText}>Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>Select Birthday</Text>
                            <TouchableOpacity 
                                onPress={handleConfirm}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.confirmText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => {
                                if (Platform.OS === 'android') {
                                    setIsOpen(false);
                                    if (event.type === 'set') {
                                        onChange(date);
                                    }
                                } else {
                                    setTempDate(date);
                                }
                            }}
                            maximumDate={maximumDate}
                            minimumDate={minimumDate}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
        height: 50,
    },
    pickerContainerSelected: {
        borderColor: '#EE6567',
        backgroundColor: '#FFF5F5',
        height: 60,
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
    textContainer: {
        flex: 1,
    },
    selectedText: {
        fontSize: 16,
        color: '#EE6567',
        fontWeight: '600',
    },
    ageText: {
        fontSize: 14,
        color: '#666666',
        marginTop: 2,
    },
    placeholderText: {
        fontSize: 16,
        color: '#999999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },
    closeText: {
        color: '#666666',
        fontSize: 16,
    },
    confirmButton: {
        padding: 4,
    },
    confirmText: {
        color: '#EE6567',
        fontSize: 16,
        fontWeight: '600',
    },
});
