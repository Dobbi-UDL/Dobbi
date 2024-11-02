import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffbbba',
  },
  content: {
    flex: 1,
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
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff0f0',
    alignItems: 'center',
  },
  successIcon: {
    marginVertical: 30,
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
    marginBottom: 20,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  redirectContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
  },
  loader: {
    marginBottom: 10,
  },
  redirectText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});