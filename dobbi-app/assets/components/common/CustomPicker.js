import React, { useState, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const CustomPicker = memo(({ 
    label,
    value,
    placeholder,
    options,
    onSelect,
    icon,
    defaultIcon // Add defaultIcon prop
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    const selectedOption = options.find(opt => opt.value === value);
    const displayIcon = selectedOption?.icon || defaultIcon;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity 
                style={[
                    styles.pickerContainer,
                    selectedOption && styles.pickerContainerSelected
                ]}
                onPress={() => setIsOpen(true)}
            >
                <View style={styles.pickerContent}>
                    {displayIcon && (
                        <MaterialIcons
                            name={displayIcon}
                            size={20}
                            color={selectedOption ? '#EE6567' : '#666666'}
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
                    <TouchableOpacity
                        style={styles.modalContent}
                        activeOpacity={1}
                    >
                        <View style={styles.modalHeader}>
                            <TouchableOpacity 
                                onPress={() => setIsOpen(false)}
                                style={styles.closeButton}
                            >
                                <MaterialIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                            <Text style={styles.modalTitle}>{placeholder}</Text>
                        </View>
                        <ScrollView>
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.option,
                                        value === option.value && styles.optionSelected
                                    ]}
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
                                        value === option.value && { color: '#EE6567', fontWeight: '600' }
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
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
});

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
        borderWidth: 1.5,
        borderColor: '#E5E5E5',
        height: 50,
    },
    pickerContainerSelected: {
        borderColor: '#EE6567',
        backgroundColor: '#FFF5F5',
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
        color: '#EE6567',
        fontWeight: '600',
    },
    placeholderText: {
        flex: 1,
        fontSize: 16,
        color: '#999999',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end'
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: SCREEN_HEIGHT * 0.9,
        minHeight: SCREEN_HEIGHT * 0.5,
        paddingBottom: 20,
        // Add shadow for iOS
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        // Add elevation for Android
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    closeButton: {
        padding: 4,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    optionSelected: {
        backgroundColor: '#FFF5F5',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#EE6567',
        borderRadius: 0,
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
