import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { defaultTabBarStyles } from './TabBar.styles';

const TabBar = ({ tabs, activeTab, onTabPress, customTabBarStyles = {} }) => {
    return (
        <View style={[defaultTabBarStyles.tabContainer, customTabBarStyles.tabContainer]}>
            {tabs.map((tab, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        defaultTabBarStyles.tab,
                        activeTab === index && defaultTabBarStyles.activeTab,
                        customTabBarStyles.tab,
                        activeTab === index && customTabBarStyles.activeTab,
                    ]}
                    onPress={() => onTabPress(index)}
                >
                    <Text
                        style={[
                            defaultTabBarStyles.tabText,
                            activeTab === index && defaultTabBarStyles.activeTabText,
                            customTabBarStyles.tabText,
                            activeTab === index && customTabBarStyles.activeTabText,
                        ]}
                    >
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default TabBar;