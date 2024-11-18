import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export default function Layout() {

  return (
    <AuthProvider>
      <Stack 
        screenOptions={{
          headerShown: false,
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
