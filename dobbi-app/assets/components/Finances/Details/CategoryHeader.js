import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../common/Button';
import { styles } from './FinancialDetails.styles';
import { truncateNumber } from '../../../../utils/numberFormatting';
import i18n from '../../../../i18n';

export const CategoryHeader = ({
    category,
    expandedCategory,
    setExpandedCategory,
    handleNumberClick,
    handleEdit,
}) => (
    <View>
        <TouchableOpacity
            style={styles.categoryHeader}
            onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
        >
            <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon} size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
            <TouchableOpacity onPress={() => handleNumberClick(category.total)}>
                <View style={styles.categoryAmount}>
                    <Text style={styles.amountText}>${truncateNumber(category.total)}</Text>
                </View>
            </TouchableOpacity>
            <Button
                title={i18n.t("edit")}
                onPress={() => handleEdit(category.id)}
                size="sm"
                style={styles.editButton}
            />
        </TouchableOpacity>
        
    </View>
);

