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
import { profileStyles } from "../../styles/profileSection";
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
              await signOut(); // Call signOut first
              onClose(); // Close the profile section before navigation
              const { error } = await supabase.auth.signOut();
              if (error) throw error;
              
              // Replace with index and prevent going back
              router.replace({
                pathname: '/',
                params: {
                  reset: true // Add param to indicate full reset
                }
              });
              
              // Reset router history
              router.setParams({ reset: true });

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

  const getCurrentAndNextLevelXP = (currentXP, currentLevel) => {
    const currentLevelXP = calculateXPForLevel(currentLevel);
    const nextLevelXP = calculateXPForLevel(currentLevel + 1);
    return `${currentXP}/${nextLevelXP} XP`;
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
      onPress: handleLanguagePress,
    },
    {
      icon: "logout",
      title: i18n.t("logout"),
      onPress: handleLogout,
      danger: true,
    },
  ];

  return (
    <View style={[profileStyles.settingsContainer, { paddingTop: insets.top }]}>
      <View style={profileStyles.settingsHeader}>
        <View style={profileStyles.profileSection}>
          <View style={profileStyles.profileRow}>
            <TouchableOpacity 
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              {avatar ? (
                <Image 
                  source={{ uri: avatar }} 
                  style={profileStyles.avatar}
                />
              ) : (
                <View style={[profileStyles.avatar, profileStyles.avatarPlaceholder]}>
                  <Text style={profileStyles.avatarText}>
                    {getInitials(userData?.username)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <View style={profileStyles.profileInfo}>
              <Text style={profileStyles.profileName}>
                {userData?.username || "User"}
              </Text>
              <View style={profileStyles.levelWrapper}>
                <View style={profileStyles.levelBadge}>
                  <Text style={profileStyles.levelText}>
                    Level {userStats?.current_level || 1}
                  </Text>
                </View>
                <Text style={profileStyles.expText}>
                  {getCurrentAndNextLevelXP(
                    userStats?.current_xp || 0,
                    userStats?.current_level || 1
                  )}
                </Text>
              </View>
              <View style={profileStyles.progressBar}>
                <View
                  style={[
                    profileStyles.progressFill,
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
        style={profileStyles.menuScroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={profileStyles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              style={[
                profileStyles.menuItem,
                index === menuItems.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <View style={profileStyles.menuItemLeft}>
                <View style={[
                  profileStyles.menuIcon,
                  item.danger && { backgroundColor: '#FFF5F5' }
                ]}>
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={item.danger ? "#ff6b6b" : "#666"}
                  />
                </View>
                <Text
                  style={[
                    profileStyles.menuText,
                    item.danger && profileStyles.menuTextDanger
                  ]}
                >
                  {item.title}
                </Text>
              </View>
              <Icon 
                name="chevron-right" 
                size={20} 
                color="#CCCCCC"
                style={profileStyles.chevron}
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
    </View>
  );
};
