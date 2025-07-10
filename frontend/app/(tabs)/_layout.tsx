import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import Ionicons from '@expo/vector-icons/Ionicons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="bankAccount"
        options={{
          title: 'Konten',
          tabBarIcon: ({ color }) => <Ionicons name="wallet" size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Konten',
          tabBarIcon: ({ color }) => <Ionicons name="medal" size={32} color={color} />,
        }}
      />
      <Tabs.Screen
        name="personalAccount"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={32} color={color} />,
        }}
      />
    </Tabs>
  );
}
