// components/Modals/PrivacyModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { styles } from "../../../styles/profile";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import i18n from "@i18n";

export const PrivacyModal = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <SafeAreaView edges={["top"]} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{i18n.t("privacy")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalBody}>
          <Text style={styles.modalText}>
            Privacy Policy{"\n\n"}
            1. Information Collection{"\n\n"}
            We collect information that you provide directly to us.{"\n\n"}
            2. How We Use Your Information{"\n\n"}
            We use the information we collect to operate and improve our
            services.{"\n\n"}
            3. Information Sharing{"\n\n"}
            We do not sell or share your personal information with third
            parties.{"\n\n"}
            [Additional privacy details would go here]
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
