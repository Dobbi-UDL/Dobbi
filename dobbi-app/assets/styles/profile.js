import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    flex: 1,
  },
  lowerSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: "flex-start",
  },
  welcomeText: {
    fontSize: 24,
    color: "#333333",
    marginBottom: 8,
  },
  usernameText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000000",
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  profileSection: {
    flex: 1,
  },
  profileAvatar: {
    width: 80,  // Reducido de 90 a 80
    height: 80, // Reducido de 90 a 80
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff6b6b",
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
  },
  avatarText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "600",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
  },
  profileLevelInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Para poner la experiencia a la derecha
    marginBottom: 6,
  },
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  levelText: {
    fontSize: 11, // Reducido de 13 a 11
    color: '#ff6b6b',
    fontWeight: '500', // Reducido de 600 a 500
    marginLeft: 4,
  },
  miniProgressBar: {
    height: 3,
    backgroundColor: "#FFE5E5",
    borderRadius: 1.5,
    width: '100%', // Cambiado de 85% a 100%
    marginTop: 4,
  },
  miniProgress: {
    height: "100%",
    backgroundColor: "#ff6b6b",
    borderRadius: 1.5,
  },
  expText: {
    fontSize: 12, // Aumentado de 11 a 12
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.2, // Añadido para mejor legibilidad
  },
  profileSubtext: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  editProfileLink: {
    color: "#ff6b6b",
    fontSize: 14,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18, // Aumentado el padding vertical
    paddingHorizontal: 24, // Aumentado el padding horizontal
    backgroundColor: '#fff',
    borderBottomWidth: 0.3, // Reducido aún más el grosor
    borderBottomColor: 'rgba(0,0,0,0.03)', // Más sutil
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16, // Aumentado el espacio entre icono y texto
    color: "#333",
    fontWeight: '400', // Más ligero
  },
  menuItemTextDanger: {
    color: "#ff6b6b",
    fontWeight: '400',
    marginLeft: 16, // Añadido para mantener consistencia con menuItemText
  },
  menuItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Quitado el fondo
  },
  menuSection: {
    backgroundColor: '#fff',
    // Quitados los márgenes y sombras para un diseño más limpio
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
  },
  modalTitle: {
    fontSize: 24, // Changed from 20 to 24
    fontWeight: "bold",
    flex: 1
  },
  closeButton: {
    padding: 8,
  },
  modalBody: {
    flex: 1,
    backgroundColor: '#FFF5F5',
    paddingTop: 16,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333333",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  levelContainer: {
    marginTop: 4,
  },
  levelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ff6b6b",
    borderRadius: 4,
  },
  experienceText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  levelSystemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginTop: 16,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  expBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#FFF5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  expText: {
    fontSize: 12, // Aumentado de 11 a 12
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.2, // Añadido para mejor legibilidad
  },
  infoSection: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#d76567',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1.2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
  },
  infoHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    width: 80,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  infoIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    borderRadius: 16,
    marginRight: 8,
  },
  editButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  pickerContainer: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
    color: '#333',
    backgroundColor: 'transparent',
    marginTop: -8,
  },
  pickerDisabled: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  editButtonFloat: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    backgroundColor: '#ff6b6b',
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    color: 'white',
    fontWeight: '600',
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#ff6b6b',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  securityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    backgroundColor: '#FFF5F5',
  },
  securityButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#ff6b6b',
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FFE5E5',
  },
  deleteButtonText: {
    color: '#ff3333',
  },
});
