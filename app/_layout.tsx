import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/locales/i18n';

import { TranslationProvider } from './TranslationContext';
import { ThemeProvider } from './ThemeContext';
import { UserProvider, } from './UserContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

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

  // Lógica para navegação baseada na autenticação
  useEffect(() => {
    if (loaded) {
      if (isAuthenticated) {
        router.replace('/onboarding'); // Se autenticado, redireciona para o explore
      } else {
        router.replace('/onboarding'); // Se não autenticado, redireciona para a tela de login
      }
    }
  }, [loaded, isAuthenticated, router]);

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
              {/* Renderiza o StackNavigator */}
              <Stack>
                <Stack.Screen name="+not-found" />
                <Stack.Screen name="createUser" options={{ title: 'Cadastro' }} />
                <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
              </Stack>
            </TranslationProvider>
          </ThemeProvider>
        </UserProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}
