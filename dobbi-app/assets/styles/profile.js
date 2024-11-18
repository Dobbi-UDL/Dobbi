import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f0',
  },
  contentContainer: {
    flex: 1,
  },
  lowerSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 100,
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 24,
    color: '#333333',
    marginBottom: 8,
  },
  usernameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc', // Placeholder background color
  },
  avatarPlaceholder: {
    backgroundColor: '#ccc', // Placeholder background color
  },
  avatarText: {
    color: '#fff', // Text color
    fontSize: 24, // Adjust font size as needed
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  editProfileLink: {
    color: '#ff6b6b',
    fontSize: 14,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
  menuItemTextDanger: {
    color: '#ff6b6b',
  },
});
