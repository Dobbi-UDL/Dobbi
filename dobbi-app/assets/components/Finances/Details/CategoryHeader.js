import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../../common/Button';
import { styles } from './FinancialDetails.styles';
import { formatCompactCurrency, formatCurrency } from '../../../../utils/numberHelpers';
import i18n from '../../../../i18n';
import { ListViewEntries } from './ListViewEntries';

export const CategoryHeader = ({
    category,
    expandedCategory,
    setExpandedCategory,
    handleEdit,
    handleAddEntry
}) => {
    // Filter out invalid entries
    const validEntries = category.entries.filter(entry => 
        entry && entry.id && entry.amount !== null && entry.name
    );

    return (
        <View>
            <TouchableOpacity
                style={styles.categoryHeader}
                onPress={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
            >
                <View style={styles.categoryIcon}>
                    <Ionicons name={category.icon} size={22} color="#EE6567" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <View style={styles.categoryAmount}>
                    <Text style={styles.amountText}>{formatCurrency(category.total)}</Text>
                </View>
            </TouchableOpacity>
            {expandedCategory === category.id && <ListViewEntries 
                entries={validEntries}
                handleEdit={handleEdit}
                handleAddEntry={() => handleAddEntry(category.id)}
            />}
        </View>
    );
};

