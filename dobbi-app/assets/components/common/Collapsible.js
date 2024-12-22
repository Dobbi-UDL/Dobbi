import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Collapsible = ({ title, isExpanded, onToggle, children }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.header} 
                onPress={onToggle}
                activeOpacity={0.7}
            >
                <Text style={styles.title}>{title}</Text>
                <Ionicons 
                    name="chevron-down" 
                    size={20} 
                    color="#666"
                    style={{
                        transform: [{ rotate: isExpanded ? '180deg' : '0deg' }]
                    }}
                />
            </TouchableOpacity>
            {isExpanded && (
                <View style={styles.content}>
                    <View style={styles.childrenContainer}>
                        {children}
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF5F5',
        marginVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#FFF5F5',
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },
    content: {
        overflow: 'hidden',
    },
    childrenContainer: {
        paddingHorizontal: 4,
        paddingVertical: 4,
    }
});