import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const CustomPicker = ({ 
    label,
    value,
    placeholder,
    options,
    onSelect,
    icon
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity 
                style={styles.pickerContainer}
                onPress={() => setIsOpen(true)}
            >
                <View style={styles.pickerContent}>
                    {icon && (
                        <MaterialIcons
                            name={icon}
                            size={20}
                            color="#666666"
                            style={styles.iconLeft}
                        />
                    )}
                    <Text style={selectedOption ? styles.selectedText : styles.placeholderText}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </Text>
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
                        <ScrollView>
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={styles.option}
                                    onPress={() => handleSelect(option)}
                                >
                                    {option.icon && (
                                        <MaterialIcons
                                            name={option.icon}
                                            size={20}
                                            color={value === option.value ? '#EE6567' : '#666666'}
                                            style={styles.optionIcon}
                                        />
                                    )}
                                    <Text style={[
                                        styles.optionText,
                                        value === option.value && styles.optionTextSelected
                                    ]}>
                                        {option.label}
                                    </Text>
                                    {value === option.value && (
                                        <MaterialIcons
                                            name="check"
                                            size={20}
                                            color="#EE6567"
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
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
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
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
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        width: '100%',
        maxHeight: 300,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    optionIcon: {
        marginRight: 12,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#333333',
    },
    optionTextSelected: {
        color: '#EE6567',
        fontWeight: '600',
    },
});
