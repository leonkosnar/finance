import React from 'react';
import { Tabs } from 'expo-router';
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
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: 'transparent',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="bankAccount"
        options={{
          title: 'Konten',
          tabBarIcon: ({ color }) => <Ionicons name="wallet" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'Ziele',
          tabBarIcon: ({ color }) => <Ionicons name="medal" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="personalAccount"
        options={{
          title: 'Account',
          tabBarIcon: ({ color }) => <Ionicons name="person" size={26} color={color} />,
        }}
      />
    </Tabs>
  );
}
