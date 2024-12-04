import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { styles } from "../../../styles/profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "@i18n";

export const EditProfileModal = ({ isVisible, onClose, userData }) => {
  const [formData, setFormData] = useState({
    username: userData?.username || "",
    email: userData?.email || "",
    // Add more fields as needed
  });

  const handleSave = async () => {
    try {
      // Add save logic here
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <SafeAreaView edges={["top"]} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{i18n.t("editProfile")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalBody}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t("username")}</Text>
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text })
              }
              placeholder={i18n.t("usernamePlaceholder")}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>{i18n.t("email")}</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder={i18n.t("emailPlaceholder")}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{i18n.t("save")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
