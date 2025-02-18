import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffbbba',
  },
  scrollView: {
    flexGrow: 1,
  },

  headerContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffbbba',
  },
  logoImage: {
    width: 200,
    height: 200,
    marginBottom: -20,
  },
  ovalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 55,
    left: 20,
    zIndex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#ff6b6b',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLink: {
    color: '#ff6b6b',
    fontSize: 14,
    fontWeight: 'bold',
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    padding: 15,
    borderRadius: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  biometricButtonText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  biometricEmailHint: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginHorizontal: 20,
  },
  biometricButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#000',
  },
});