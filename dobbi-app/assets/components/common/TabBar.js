import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TabBar = ({ tabs, activeTab, onTabPress }) => {
    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab, index) => (
                // Render each tab as a TouchableOpacity
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.tab,
                        activeTab === index && styles.activeTab // Apply activeTab style if this tab is active
                    ]}
                    onPress={() => onTabPress(index)} // Handle tab press
                >
                    <Text style={[
                        styles.tabText,
                        activeTab === index && styles.activeTabText // Apply activeTabText style if this tab is active
                    ]}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 48,
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
    },
    activeTabText: {
        color: '#000',
    },
});

export default TabBar;