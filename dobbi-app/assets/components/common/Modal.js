import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const CustomModal = ({ visible, onClose, title, children, onSubmit, fullWidth }) => {
    return (
        <Modal
            visible={visible}
            onRequestClose={onClose}
            animationType="slide"
            transparent={true}
        >
            <View style={styles.modalOverlay}>
                <View style={[
                    styles.modalContent,
                    fullWidth && styles.fullWidth
                ]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={onClose}
                        >
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>
                    {children}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 8,
        paddingTop: 10,
        alignItems: 'center',
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: [{ translateY: -12 }],  // mitad del tamaño del icono
        padding: 8,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
        width: '90%',  // Ancho por defecto
        maxWidth: 500,
        elevation: 5,
    },
    fullWidth: {
        width: '95%',  // Ancho más amplio cuando se requiere
    },
    modalContentContainer: {
        paddingBottom: 20,
    },
});
