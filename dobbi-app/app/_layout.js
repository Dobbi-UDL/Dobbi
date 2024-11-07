import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import Header from '../assets/components/Header/Header';

const isAuthenticated = true; // Mock data to store if the user is authenticated

const CustomHeader = () => <Header />;

export default function Layout() {
  return (
    <AuthProvider>
      <Stack 
        screenOptions={{
          headerShown: isAuthenticated, // Show or hide the header based on the user authentication
          header: CustomHeader,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen
          name="home"
          options={{
            animation: 'none'
          }}
        />
        <Stack.Screen
          name="finances"
          options={{
            animation: 'none'
          }}
        />
        <Stack.Screen
          name="assistant"
          options={{
            animation: 'none'
          }}
        />
        <Stack.Screen
          name="marketplace"
          options={{
            animation: 'none'
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            animation: 'none'
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
