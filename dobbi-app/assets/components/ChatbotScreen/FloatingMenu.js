import React from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const FloatingMenu = ({ isOpen, animation, onHistoryPress, onNewChatPress, onDeleteChat, canDelete }) => {
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [48, -160], 
  });

  const handlePress = (handler) => () => {
    if (handler) {
      handler();
    }
  };

  return isOpen ? (
    <View style={styles.menuContainer}>
      <Animated.View style={[
        styles.menuItems,
        { transform: [{ translateY }] }
      ]}>
        {canDelete && (
          <TouchableOpacity 
            style={styles.menuButton} 
            onPress={handlePress(onDeleteChat)}
          >
            <View style={styles.buttonContent}>
              <MaterialIcons name="delete" size={24} color="#E57373" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={handlePress(onHistoryPress)}
        >
          <View style={styles.buttonContent}>
            <MaterialIcons name="history" size={24} color="#E57373" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.menuButton} 
          onPress={handlePress(onNewChatPress)}
        >
          <View style={styles.buttonContent}>
            <MaterialIcons name="add" size={24} color="#E57373" />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  menuContainer: {
    position: 'absolute',
    bottom: -84, // -36 - 48 (menu button height)
    right: 16,
    width: 48, // Increased from 40 to match menu button
    alignItems: 'center',
  },
  menuItems: {
    alignItems: 'center',
    gap: 16, // Space between buttons
  },
  menuButton: {
    width: 48, // Increased from 40
    height: 48, // Increased from 40
    borderRadius: 24, // Half of width/height
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#553334",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 8,
    color: '#E57373',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FloatingMenu;