import React from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { styles } from "./BottomNavBar.styles";
import { Ionicons } from "@expo/vector-icons";

export const BottomNavBar = () => {
  const showText = false;
  const router = useRouter();
  const currentPath = usePathname();

  const activeColor = "#EE6567";
  const inactiveColor = "#FFB3B3";

  const navigationItems = [
    { name: "Home", icon: "home", route: "/home" },
    { name: "Finances", icon: "pie-chart", route: "/finances" },
    { name: "Offers", icon: "pricetags", route: "/offers" },
    { name: "Challenges", icon: "trophy", route: "/challenges" },
    { name: "ChatBot", icon: "chatbox-ellipses", route: "/assistant" },
  ];

  const handleNavigation = (route) => {
    if (currentPath !== route) {
      router.push(route);
    }
  };

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={[
        styles.safeArea,
        Platform.OS === "ios" && { marginTop: 20 }, // Aplica margen extra solo en iOS
      ]}
    >
      <View style={[styles.navContainer]}>
        {navigationItems.map((item) => {
          const isActive = currentPath === item.route;
          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => handleNavigation(item.route)}
            >
              <Ionicons
                name={item.icon}
                size={24}
                color={isActive ? activeColor : inactiveColor}
              />
              {showText && (
                <Text
                  style={[styles.navText, isActive && styles.activeNavText]}
                >
                  {item.name}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};
