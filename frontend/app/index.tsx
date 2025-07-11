import React from 'react';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { registerAppStateListener } from "@/utils/appLifecycle";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          router.replace('/welcome');
        }
      } catch (e) {
        console.error('Fehler bei Login-Check:', e);
        router.replace('/welcome');
      } finally {
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    };
    check();
  }, []);

  registerAppStateListener();
  if (!isReady) return null;

  return <StatusBar style="auto" />;
}
