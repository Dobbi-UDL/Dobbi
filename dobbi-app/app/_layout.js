import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import { StatusBar } from 'expo-status-bar';
import { HeaderProvider } from '../contexts/HeaderContext';

export default function Layout() {
  return (
    <HeaderProvider>
      <LanguageProvider>
        <AuthProvider>
          <StatusBar style="dark" backgroundColor="#ffffff" />
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
    </HeaderProvider>
  );
}
