import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { styles } from './BudgetValue.styles';

const BudgetValue = ({ amount, label, valueStyle, labelStyle, icon }) => (
    <View style={styles.container}>
        <View style={styles.valueContainer}>
            {icon}
            <Text style={StyleSheet.flatten([styles.value, valueStyle])}>
                ${Math.abs(amount).toLocaleString()}
            </Text>
        </View>
        <Text style={StyleSheet.flatten([styles.label, labelStyle])}>
            {label}
        </Text>
    </View>
);

BudgetValue.propTypes = {
    amount: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.element,
    valueStyle: PropTypes.object,
    labelStyle: PropTypes.object,
};

export default BudgetValue;