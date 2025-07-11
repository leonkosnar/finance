import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useAuthStore } from '@/hooks/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const { loadStoredCredentials, isLoading } = useAuthStore();

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        await loadStoredCredentials();
        await SplashScreen.hideAsync();

        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/welcome');
        }
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
