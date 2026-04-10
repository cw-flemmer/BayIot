import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

import { useColorScheme } from '../hooks/use-color-scheme';
import { useAuthStore } from '../store/authStore';


// Initialize notification handler early

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { token, isLoading, loadStorageData } = useAuthStore();
  const colorScheme = useColorScheme();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    loadStorageData().finally(() => {
      setIsReady(true);
    });
  }, [loadStorageData]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    if (isReady && !isLoading && !token) {
      // Use setTimeout to ensure navigation is ready
      const timer = setTimeout(() => {
        router.replace('/login');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [token, isLoading, isReady]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="dashboard/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Details' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
