import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/navigation';

export const BottomNavBar = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const navigationItems = [
    { 
      name: 'Finances', 
      icon: 'chart-pie', 
      route: '/finances' 
    },
    { 
      name: 'ChatBot', 
      icon: 'message-processing-outline', 
      route: '/assistant' 
    },
    { 
      name: 'Home', 
      icon: 'home', 
      route: '/home' 
    },
    { 
      name: 'Marketplace', 
      icon: 'shopping-outline', 
      route: '/marketplace' 
    },
    { 
      name: 'Profile', 
      icon: 'account-outline', 
      route: '/profile' 
    },
  ];

  const handleNavigation = (route) => {
    // Si ya estamos en la ruta actual, no hacemos nada
    if (currentPath === route) {
      return;
    }

    try {
      router.push(route);
    } catch (error) {
      console.error('Error navigating to:', route, error);
    }
  };

  return (
    <View style={styles.navContainer}>
      {navigationItems.map((item) => {
        const isActive = currentPath === item.route;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => handleNavigation(item.route)}
          >
            <Icon
              name={item.icon}
              size={24}
              color={isActive ? '#ff6b6b' : '#757575'}
              style={styles.icon}
            />
            <Text style={[
              styles.navText,
              isActive && styles.activeNavText
            ]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};