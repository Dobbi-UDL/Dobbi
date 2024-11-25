import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';

export default function Layout() {

  return (
    <LanguageProvider>
      <AuthProvider>
        <Stack 
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            statusBarColor: '#ffffff',
            statusBarStyle: '#000000',
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
            name="challenges"
            options={{
              animation: 'none'
            }}
          />
          <Stack.Screen
            name="offers"
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
    </LanguageProvider>
  );
}
