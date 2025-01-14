import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { styles } from '../../styles/marketplace';
import i18n from '../../../i18n';

export const CategoryFilter = ({ categories, onSelectCategories, showRedeemed, onShowRedeemed }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryToggle = (category) => {
    const isSelected = selectedCategories.some(c => c.id === category.id);
    let newSelectedCategories;

    if (isSelected) {
      newSelectedCategories = selectedCategories.filter(c => c.id !== category.id);
    } else {
      newSelectedCategories = [...selectedCategories, category];
    }

    setSelectedCategories(newSelectedCategories);
    onSelectCategories(newSelectedCategories);
  };

  return (
    <View style={styles.categoryFilterContainer}>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScrollView}
        contentContainerStyle={styles.categoryScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            showRedeemed && styles.selectedCategoryChip
          ]}
          onPress={() => onShowRedeemed(!showRedeemed)}
        >
          <Text style={[
            styles.categoryChipText,
            showRedeemed && styles.selectedCategoryChipText
          ]}>
            {i18n.t('redeemed_offers')}
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategories.some(c => c.id === category.id) && styles.selectedCategoryChip
            ]}
            onPress={() => handleCategoryToggle(category)}
          >
            <Text style={[
              styles.categoryChipText,
              selectedCategories.some(c => c.id === category.id) && styles.selectedCategoryChipText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};