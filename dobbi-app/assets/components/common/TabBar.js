import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './TabBar.styles';

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

export default TabBar;