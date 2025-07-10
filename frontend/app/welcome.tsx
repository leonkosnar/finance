import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function WelcomeBack() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Willkommen zurück!</Text>
      <Button title="Login" onPress={() => router.push('/login')} />
      {/* <Button title="Register" onPress={() => router.push('/register')} /> */}
    </View>
  );
}
