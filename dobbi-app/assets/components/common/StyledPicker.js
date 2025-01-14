import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const StyledPicker = ({
    label,
    value,
    placeholder,
    options,
    onSelect,
    icon,
    multiSelect = false
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const getDisplayValue = () => {
        if (!value) return placeholder;
        if (multiSelect) {
            if (Array.isArray(value) && value.length > 0) {
                return `${value.length} selected`;
            }
            return placeholder;
        }
        return options.find(opt => opt.id === value)?.title || placeholder;
    };

    return (
        <View style={styles.inputGroup}>
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
                    <Text style={value ? styles.selectedText : styles.placeholderText}>
                        {getDisplayValue()}
                    </Text>
                    <MaterialIcons
                        name="keyboard-arrow-down"
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
                {/* ...existing modal content... */}
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // Copy the styles from the existing picker components and standardize them
});
