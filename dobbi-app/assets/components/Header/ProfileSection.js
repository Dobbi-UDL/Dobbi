// assets/components/Header/ProfileSection.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../../styles/profile.js";
import i18n from "@i18n";
import { useAuth } from "@authcontext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LanguageModal } from "./LanguageModal";
import { supabase } from "../../../config/supabaseClient.js";
import { PrivacyModal } from "./Modals/PrivacyModal.js";
import { TermsModal } from "./Modals/TermsModal.js";
import { EditProfileModal } from "./Modals/EditProfileModal.js";
import {
  calculateXPForLevel,
  calculateProgressPercentage,
} from "../../../utils/experienceSystem";
import { OnboardingForm } from "../Onboarding/OnboardingForm.js";

export const ProfileSection = ({ userData, onClose }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
    useState(false);
  const [userStats, setUserStats] = useState(null);

  useEffect(() => {
    if (userData?.id) {
      fetchUserStats();
    }
  }, [userData]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('current_xp, current_level')
        .eq('id', userData.id)
        .single();

      if (error) throw error;

      setUserStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleEditProfile = () => {
    setIsEditProfileModalVisible(true);
  };

  const handleLogout = async () => {
    try {
      signOut;
      if (error) throw error;
    } catch (err) {
      console.error("Error during signOut:", err);
      throw err;
    }
  };

  const handleLanguagePress = () => {
    setIsLanguageModalVisible(true);
  };

  const [isOnboardingFormVisible, setIsOnboardingFormVisible] = useState(false);
  const handleOpenOnboardingForm = () => {
    setIsOnboardingFormVisible(true);
  };

  const menuItems = [
    {
      icon: "shield-account",
      title: i18n.t("privacy"),
      onPress: () => setIsPrivacyModalVisible(true),
    },
    {
      icon: "file-document",
      title: i18n.t("terms"),
      onPress: () => setIsTermsModalVisible(true),
    },
    {
      icon: "translate",
      title: i18n.t("language"),
      onPress: handleLanguagePress, // Updated handler
    },
    {
      icon: "logout",
      title: i18n.t("logout"),
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <View style={[styles.settingsContainer, { paddingTop: insets.top }]}>
      <View style={styles.settingsHeader}>
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <TouchableOpacity onPress={handleEditProfile}>
              <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>
                  {getInitials(userData?.username)}
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userData?.username || "User"}
              </Text>
            </View>
          </View>
          <View style={styles.levelSystemContainer}>
            <View style={styles.levelHeader}>
              <View style={styles.levelBadge}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.levelText}>
                  Level {userStats?.current_level || 1}
                </Text>
              </View>
              <View style={styles.expBadge}>
                <Icon name="lightning-bolt" size={14} color="#FF6B6B" />
                <Text style={styles.expText}>
                  {userStats?.current_xp || 0}/
                  {calculateXPForLevel(userStats?.current_level || 1)} XP
                </Text>
              </View>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${calculateProgressPercentage(
                      userStats?.current_xp || 0,
                      userStats?.current_level || 1
                    )}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={styles.menuItem}
          >
            <View style={styles.menuItemContent}>
              <Icon
                name={item.icon}
                size={24}
                color={item.danger ? "red" : "#000"}
              />
              <Text
                style={
                  item.danger ? styles.menuItemTextDanger : styles.menuItemText
                }
              >
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <LanguageModal
        isVisible={isLanguageModalVisible}
        onClose={() => setIsLanguageModalVisible(false)}
      />
      <PrivacyModal
        isVisible={isPrivacyModalVisible}
        onClose={() => setIsPrivacyModalVisible(false)}
      />
      <TermsModal
        isVisible={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
      />
      <EditProfileModal
        isVisible={isEditProfileModalVisible}
        onClose={() => setIsEditProfileModalVisible(false)}
        userData={userData}
      />
      <Modal
        visible={isOnboardingFormVisible}
        animationType="slide"
        onRequestClose={() => setIsOnboardingFormVisible(false)}
      >
        <OnboardingForm
          userId={userData?.id}
          onComplete={() => setIsOnboardingFormVisible(false)}
        />
      </Modal>
    </View>
  );
};
