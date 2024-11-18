import ExpoRouter from 'expo-router';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ExpoRouter />
    </AuthProvider>
  );
}
