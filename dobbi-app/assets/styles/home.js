import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  upperSection: {
    height: '30%',
    backgroundColor: '#fff0f0',
    justifyContent: 'flex-end',
  },
  lowerSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'flex-start',
  },
  ovalContainer: {
    position: 'absolute',
    bottom: -1,
    width: '100%',
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
});