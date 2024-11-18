import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import TabBar from './TabBar';

const TabView = ({ tabs, children, styles }) => {
    const [activeTab, setActiveTab] = useState(0);
    const scrollViewRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;

        // Calculate the index of the active tab based on the scroll position
        const index = Math.round(scrollPosition / screenWidth);
        
        // Update the active tab if it has changed
        if (index !== activeTab) {
            setActiveTab(index);
        }
    };

    const handleTabPress = (index) => {
        setActiveTab(index);
        scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });
    };

    return (
        <View style={{ flex: 1 }}>
            <TabBar
                tabs={tabs}
                activeTab={activeTab}
                onTabPress={handleTabPress}
                customTabBarStyles={ styles }
            />
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Render each child inside a View with the width of the screen */}
                {React.Children.map(children, (child) => (
                    <View style={{ width: screenWidth }}>
                        {child}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default TabView;