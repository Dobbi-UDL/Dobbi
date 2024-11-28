import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { styles } from '../../styles/marketplace';

export const CategoryFilter = ({ categories, onSelectCategories }) => {
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
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.categoryContainer}
      contentContainerStyle={styles.categoryScrollContent}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryItem,
            selectedCategories.some(c => c.id === category.id) && styles.selectedCategoryItem
          ]}
          onPress={() => handleCategoryToggle(category)}
        >
          <Text style={[
            styles.categoryText,
            selectedCategories.some(c => c.id === category.id) && styles.selectedCategoryText
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};