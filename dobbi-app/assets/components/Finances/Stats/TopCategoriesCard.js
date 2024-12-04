
import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Card from '../../common/Card';
import { Ionicons } from '@expo/vector-icons';

export const TopCategoriesCard = ({ title, data, type }) => {
    const getBarColor = () => {
        return type === 'income' ? '#4CAF50' : '#EE6567';
    };

    const renderCategoryItem = (item, index) => {
        const barWidth = `${item.percentage}%`;
        
        return (
            <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                    <View style={styles.iconContainer}>
                        <View style={[styles.iconBackground, { backgroundColor: `${getBarColor()}20` }]}>
                            <Ionicons name={item.category_icon} size={24} color={getBarColor()} />
                        </View>
                    </View>
                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName}>{item.category_name}</Text>
                        <Text style={styles.categoryAmount}>${item.total_amount}</Text>
                    </View>
                    <Text style={[styles.percentage, { color: getBarColor() }]}>
                        {item.percentage.toFixed(1)}%
                    </Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <View 
                        style={[
                            styles.progressBar, 
                            { 
                                backgroundColor: getBarColor(),
                                width: barWidth 
                            }
                        ]} 
                    />
                </View>
            </View>
        );
    };

    return (
        <Card title={title} style={styles.card}>
            <View style={styles.container}>
                {data.map((item, index) => renderCategoryItem(item, index))}
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: 16,
    },
    container: {
        marginTop: 8,
    },
    categoryItem: {
        marginBottom: 16,
    },
    categoryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconContainer: {
        marginRight: 12,
    },
    iconBackground: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryInfo: {
        flex: 1,
    },
    categoryName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333333',
        marginBottom: 2,
    },
    categoryAmount: {
        fontSize: 14,
        color: '#666666',
    },
    percentage: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    progressBarContainer: {
        height: 4,
        backgroundColor: '#F5F5F5',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
});