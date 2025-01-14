// assets/components/Header/ProfileSection.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Image,
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
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (userData?.id) {
      fetchUserStats();
      fetchAvatar();
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

  const fetchAvatar = async () => {
    try {
      const { data } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(`${userData.id}/avatar.png`, 3600);

      if (data?.signedUrl) {
        setAvatar(data.signedUrl);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
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
    Alert.alert(
      i18n.t('logout'),
      i18n.t('logout_confirmation'),
      [
        {
          text: i18n.t('cancel'),
          style: 'cancel'
        },
        {
          text: i18n.t('logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              
              signOut(); // Llama a la función del contexto de autenticación
              router.replace('/'); // Redirige al inicio
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert(
                'Error',
                i18n.t('logout_error')
              );
            }
          }
        }
      ]
    );
  };

  const handleLanguagePress = () => {
    setIsLanguageModalVisible(true);
  };

  const [isOnboardingFormVisible, setIsOnboardingFormVisible] = useState(false);
  const handleOpenOnboardingForm = () => {
    setIsOnboardingFormVisible(true);
  };

  const getCurrentAndNextLevelXP = (currentXP, currentLevel) => {
    const currentLevelXP = calculateXPForLevel(currentLevel);
    const nextLevelXP = calculateXPForLevel(currentLevel + 1);
    return `${currentXP}/${nextLevelXP} XP`;
  };

  const renderAvatar = () => {
    if (avatar) {
      return (
        <Image 
          source={{ uri: avatar }} 
          style={[styles.profileAvatar, { backgroundColor: 'transparent' }]}
        />
      );
    }
    return (
      <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
        <Text style={styles.avatarText}>
          {getInitials(userData?.username)}
        </Text>
      </View>
    );
  };

  const renderMenuIcon = (name, danger = false) => (
    <View style={[styles.menuItemIcon, { backgroundColor: danger ? '#FFF5F5' : 'transparent' }]}>
      <Icon 
        name={name} 
        size={20} 
        color={danger ? "#ff6b6b" : "#666"}
      />
    </View>
  );

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
            <TouchableOpacity 
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              {renderAvatar()}
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {userData?.username || "User"}
              </Text>
              <View style={styles.profileLevelInfo}>
                <View style={styles.levelIndicator}>
                  <Text style={styles.levelText}>
                    Level {userStats?.current_level || 1}
                  </Text>
                </View>
                <Text style={styles.expText}>
                  {getCurrentAndNextLevelXP(
                    userStats?.current_xp || 0,
                    userStats?.current_level || 1
                  )}
                </Text>
              </View>
              <View style={styles.miniProgressBar}>
                <View
                  style={[
                    styles.miniProgress,
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
      </View>

      <ScrollView 
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <View style={styles.menuItemContent}>
                {renderMenuIcon(item.icon, item.danger)}
                <Text
                  style={
                    item.danger ? styles.menuItemTextDanger : styles.menuItemText
                  }
                >
                  {item.title}
                </Text>
              </View>
              <Icon 
                name="chevron-right" 
                size={20} 
                color="#CCCCCC"
              />
            </TouchableOpacity>
          ))}
        </View>
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
        onClose={() => {
          setIsEditProfileModalVisible(false);
          fetchAvatar(); // Refetch avatar when modal closes
        }}
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
