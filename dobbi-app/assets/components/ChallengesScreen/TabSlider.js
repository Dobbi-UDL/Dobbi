import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MyGoalsCard from './MyGoalsCard';

const TabSlider = () => {
  const [activeTab, setActiveTab] = useState('myGoals');

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'myGoals' && styles.activeTab]}
          onPress={() => handleTabPress('myGoals')}
        >
          <Text style={[styles.tabText, activeTab === 'myGoals' && styles.activeTabText]}>
            My Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sponsoredGoals' && styles.activeTab]}
          onPress={() => handleTabPress('sponsoredGoals')}
        >
          <Text style={[styles.tabText, activeTab === 'sponsoredGoals' && styles.activeTabText]}>
            Sponsored Goals
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabContent}>
        {activeTab === 'myGoals' && <MyGoalsCard />}
        {activeTab === 'sponsoredGoals' && <SponsoredGoalsCard />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ffd9d9',
  },
  activeTab: {
    borderBottomColor: '#ff6b6b',
  },
  tabText: {
    fontSize: 16,
    color: '#666666',
  },
  activeTabText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
  },
});

export default TabSlider;