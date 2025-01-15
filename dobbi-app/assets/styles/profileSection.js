import { StyleSheet } from "react-native";

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  header: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E5',
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
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
  levelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelBadge: {
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
    fontSize: 11,
    color: '#ff6b6b',
    fontWeight: '500',
    marginLeft: 4,
  },
  expText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  progressBar: {
    height: 3,
    backgroundColor: "#FFE5E5",
    borderRadius: 1.5,
    width: '100%',
    marginTop: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#ff6b6b",
    borderRadius: 1.5,
  },
  menuScroll: {
    flex: 1,
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuSection: {
    backgroundColor: '#fff',
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 18,
    paddingHorizontal: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 0.3,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 16,
    color: "#333",
    fontWeight: '400',
  },
  menuTextDanger: {
    color: "#ff6b6b",
    fontWeight: '400',
    marginLeft: 16,
  },
  chevron: {
    marginLeft: 8,
  }
});
