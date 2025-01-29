import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales/i18n';

import { TranslationProvider } from './TranslationContext';
import { ThemeProvider } from './ThemeContext';
import { UserProvider } from './UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './(auth)/login';
import Home from './(home)/home';
import createUser from './(auth)/createUser';
import Onboarding from './(onboarding)/onboarding';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Simulando o estado de autenticação

  const queryClient = new QueryClient();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync(); // Esconde o splash screen após o carregamento das fontes
    }
  }, [loaded]);

  // A tela não pode ser renderizada até que as fontes estejam carregadas
  if (!loaded) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ThemeProvider>
            <TranslationProvider>
              <StatusBar style="auto" />
              {/* Navegação condicional com base na autenticação */}
              <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={createUser} />
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="Onboarding" component={Onboarding} />

              </Stack.Navigator>
            </TranslationProvider>
          </ThemeProvider>
        </UserProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
