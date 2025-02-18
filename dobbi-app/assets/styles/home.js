import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F5',
  },
  contentContainer: {
    padding: 16,
    flex: 1,
  },
  lowerSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 70,
    alignItems: 'flex-start',
  },
  DobbiText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  WelcomeText: {
    fontSize: 20,
    color: '#333333',
    marginBottom: 8,
  },
  simpleText: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    marginBottom: 20,
  },
  testButton: {
    backgroundColor: '#ff6b6b',
    padding: 15,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
