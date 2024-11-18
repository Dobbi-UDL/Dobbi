import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#ffffff',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: '#ffd9d9',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  icon: {
    marginBottom: 3,
  },
  navText: {
    fontSize: 12,
    color: '#757575',
  },
  activeNavText: {
    color: '#ff6b6b',
    fontWeight: '500',
  },
});