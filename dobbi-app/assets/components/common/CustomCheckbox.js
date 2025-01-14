import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export const CustomCheckbox = ({ value, onValueChange, tintColors }) => {
    return (
        <TouchableOpacity
            onPress={() => onValueChange(!value)}
            activeOpacity={0.7}
        >
            <View style={[
                styles.checkbox,
                {
                    backgroundColor: value ? (tintColors?.true || '#EE6567') : 'transparent',
                    borderColor: value ? (tintColors?.true || '#EE6567') : (tintColors?.false || '#666666'),
                }
            ]}>
                {value && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 4,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
