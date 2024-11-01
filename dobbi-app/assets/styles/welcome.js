import { StyleSheet, Dimensions } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f0',
  },
  upperSection: {
    height: '50%',
    backgroundColor: '#ffbbba',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    position: 'relative',
  },
  ovalContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
  lowerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  heartImage: {
    width: 500,
    height: 500,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    lineHeight: 24,
  },
  questionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 60,
    width: '80%',
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#F66C72',
  },
  loginButton: {
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});