// assets/components/Header/ProfileSection.js
import React, { useState } from "react";
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

export const ProfileSection = ({ userData, onClose }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] =
    useState(false);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const handleEditProfile = () => {
    onClose();
    router.push("/profile");
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error("Error during signOut:", err);
      throw err;
    }
  };

  const handleLanguagePress = () => {
    setIsLanguageModalVisible(true);
  };

  const menuItems = [
    // {
    //   icon: "cog",
    //   title: i18n.t("settings"),
    //   onPress: () => console.log("Settings pressed"),
    // },
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
          <View style={[styles.profileAvatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>
              {getInitials(userData?.username)}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {userData?.username || "User"}
            </Text>
            <TouchableOpacity onPress={handleEditProfile}>
              <Text style={styles.editProfileLink}>
                {i18n.t("editProfile")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={onClose}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
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
    </View>
  );
};
