// components/Modals/TermsModal.js
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

export const TermsModal = ({ isVisible, onClose }) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent={false}>
      <SafeAreaView edges={["top"]} style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{i18n.t("terms")}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalBody}>
          <Text style={styles.modalText}>
            1. Acceptance of Terms{"\n\n"}
            By accessing and using this application, you accept and agree to be
            bound by the terms and conditions.{"\n\n"}
            2. Use License{"\n\n"}
            Permission is granted to temporarily download one copy of the app
            for personal use only.{"\n\n"}
            3. Disclaimer{"\n\n"}
            The materials on this app are provided on an 'as is' basis.{"\n\n"}
            [Additional terms would go here]
          </Text>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};
