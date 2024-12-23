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
        backgroundColor: '#FFF5F5', // Fondo muy suave rosado
        marginVertical: 8,
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#FFE5E5', // Borde suave que coincide con el tema
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFE5E5', // Header ligeramente más oscuro que el container
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#EE6567', // Color principal de la app
    },
    content: {
        overflow: 'hidden',
        backgroundColor: '#FFF5F5', // Mismo color que el container
    },
    childrenContainer: {
        padding: 12,
    }
});