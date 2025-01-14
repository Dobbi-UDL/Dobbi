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
  },
  profileSection: {
    flex: 1,
    flexDirection: "column",
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff6b6b",
  },
  avatarPlaceholder: {
    backgroundColor: "#ccc", // Placeholder background color
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "600",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginLeft: 16,
  },
  editProfileLink: {
    color: "#ff6b6b",
    fontSize: 14,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#333",
  },
  menuItemTextDanger: {
    color: "#ff6b6b",
  },
  // styles/profile.js - Update the modal styles
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    flex: 1,
    textAlign: 'center',
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
  // Add to styles/profile.js
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",  // Color verde para distinguir
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
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ff6b6b",
    borderRadius: 3,
  },
  experienceText: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  levelSystemContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginTop: 16,
  },
  levelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  expBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  expText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
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
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  pickerContainer: {
    flex: 1,
    marginLeft: 12,
  },
  picker: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    height: 40,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Cambiado de 'flex-end' a 'center'
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
  },
  saveButton: {
    backgroundColor: '#4CAF50',  // Color verde para distinguir
    padding: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 24, // Aumentado para dar más ancho al botón
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 120, // Añadido para dar un ancho mínimo consistente
    alignItems: 'center', // Centrar el texto dentro del botón
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  cancelButtonText: {
    color: '#ff6b6b',
    fontSize: 15,
    fontWeight: '600',
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
  editButtonText: {
    display: 'none', // Ocultamos el texto, solo mostraremos el icono
  },
});
