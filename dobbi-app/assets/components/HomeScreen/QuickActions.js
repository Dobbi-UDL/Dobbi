import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import i18n from '@i18n';
import Card from '../common/Card';
import { useRouter } from 'expo-router';
import { AddGoalForm } from '../ChallengesScreen/AddGoalForm';
import { AddEntryForm } from '../Finances/Details/AddEntryForm'; 

export const QuickActions = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const router = useRouter(); 

   const actions = [
    { icon: 'plus', label: i18n.t('addEntry'), color: '#4CAF50', onClick: () => openModal('addEntry') },
    { icon: 'chart-line', label: i18n.t('budget'), color: '#FF9800', onClick: () => router.push('stats') }, 
    { icon: 'bookmark-plus-outline', label: i18n.t('setGoal'), color: '#3F51B5', onClick: () => openModal('setGoal') }, 
  ];


  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null); 
  };

  return (
    <Card>
      <Text style={styles.title}>{i18n.t('quickActionsTitle')}</Text>
      <View style={styles.actionsContainer}>
        {actions.map((action, index) => (
          <TouchableOpacity
            key={index}
            style={styles.actionItem}
            onPress={action.onClick} // Ejecutar acción al presionar
          >
            <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
              <Icon name={action.icon} size={30} color="#fff" />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal para mostrar los formularios dependiendo del tipo */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal} // Cerrar el modal al presionar fuera
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Condicional para mostrar el formulario según el tipo */}
            {modalType === 'addEntry' && (
              <AddEntryForm onClose={closeModal} />
            )}
            {modalType === 'setGoal' && (
              <AddGoalForm onClose={closeModal} />
            )}
            {/* Botón de cerrar */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  actionLabel: {
    fontSize: 14,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', 
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#FF5252',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
