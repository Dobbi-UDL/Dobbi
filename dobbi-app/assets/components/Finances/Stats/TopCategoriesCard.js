import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Card from '../../common/Card';
import { Ionicons } from '@expo/vector-icons';
import { CustomModal } from '../../common/Modal';

export const TopCategoriesCard = ({ title, data, type }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const barAnimations = useRef(data.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        // Animate bars sequentially
        const animations = barAnimations.map((anim, index) => {
            return Animated.timing(anim, {
                toValue: 1,
                duration: 600,
                delay: index * 100, // Stagger effect
                useNativeDriver: false,
            });
        });

        Animated.stagger(100, animations).start();
    }, [data]);

    const getBarColor = () => {
        return type === 'income' ? '#4CAF50' : '#EE6567';
    };

    const handleCategoryPress = (item) => {
        setSelectedCategory(item);
        setModalVisible(true);
    };

    const renderCategoryItem = (item, index) => {
        const barWidth = barAnimations[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', `${item.percentage}%`],
        });
        
        return (
            <TouchableOpacity 
                key={index} 
                style={styles.categoryItem}
                onPress={() => handleCategoryPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.categoryHeader}>
                    <View style={styles.iconContainer}>
                        <Animated.View 
                            style={[
                                styles.iconBackground, 
                                { 
                                    backgroundColor: `${getBarColor()}20`,
                                    transform: [{
                                        scale: barAnimations[index].interpolate({
                                            inputRange: [0, 0.5, 1],
                                            outputRange: [0.5, 1.2, 1]
                                        })
                                    }]
                                }
                            ]}
                        >
                            <Ionicons name={item.category_icon} size={24} color={getBarColor()} />
                        </Animated.View>
                    </View>
                    <View style={styles.categoryInfo}>
                        <Text style={styles.categoryName}>{item.category_name}</Text>
                        <Text style={styles.categoryAmount}>${item.total_amount}</Text>
                    </View>
                    <Animated.Text 
                        style={[
                            styles.percentage, 
                            { 
                                color: getBarColor(),
                                opacity: barAnimations[index]
                            }
                        ]}
                    >
                        {item.percentage.toFixed(1)}%
                    </Animated.Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <Animated.View 
                        style={[
                            styles.progressBar, 
                            { 
                                backgroundColor: getBarColor(),
                                width: barWidth 
                            }
                        ]} 
                    />
                </View>
            </TouchableOpacity>
        );
    };

    const renderCategoryModal = () => {
        if (!selectedCategory) return null;

        return (
            <CustomModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                title={`${selectedCategory.category_name} Details`}
            >
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <View style={[styles.iconBackground, { backgroundColor: `${getBarColor()}20` }]}>
                            <Ionicons name={selectedCategory.category_icon} size={32} color={getBarColor()} />
                        </View>
                        <Text style={styles.modalAmount}>${selectedCategory.total_amount}</Text>
                        <Text style={[styles.modalPercentage, { color: getBarColor() }]}>
                            {selectedCategory.percentage.toFixed(1)}%
                        </Text>
                    </View>
                    
                    {/* Placeholder for additional category details */}
                    <Text style={styles.modalSection}>Transaction History</Text>
                    <Text style={styles.modalSection}>Monthly Trend</Text>
                    <Text style={styles.modalSection}>Budget Status</Text>
                </View>
            </CustomModal>
        );
    };

    return (
        <Card title={title} style={styles.card}>
            <View style={styles.container}>
                {data.map((item, index) => renderCategoryItem(item, index))}
            </View>
            {renderCategoryModal()}
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
    modalContent: {
        padding: 16,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalAmount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 12,
    },
    modalPercentage: {
        fontSize: 18,
        fontWeight: '500',
        marginTop: 4,
    },
    modalSection: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
});