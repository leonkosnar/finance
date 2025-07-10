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

        const username = await AsyncStorage.getItem('username');
        const token = await AsyncStorage.getItem('token');
        const bankPassword = await AsyncStorage.getItem('bankPassword');
        console.log("username: ", username, "token: ", token, "bankPassword: ", bankPassword, "router: ", router);
        if (!token) {
          router.replace('/welcome');
          console.log("weiterleiten")
        }
      }
    });
    return () => subscription.remove();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
