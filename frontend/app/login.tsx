import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bankPassword, setBankPassword] = useState('');
  const { login } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
  if (!username.trim() || !password.trim() || !bankPassword.trim()) {
    Alert.alert('Fehler', 'Bitte alle Felder ausfüllen.');
    return;
  }

  try {
    await login(username.trim(), password.trim(), bankPassword.trim());
    router.replace('/(tabs)/bankAccount');
  } catch (err) {
    Alert.alert('Login fehlgeschlagen', 'Benutzername oder Passwort ist falsch.');
    console.error(err);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} autoCapitalize='none'/>
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={styles.input} autoCapitalize='none'/>
      <TextInput placeholder=" Bank Password" secureTextEntry value={bankPassword} onChangeText={setBankPassword} style={styles.input} autoCapitalize='none'/>
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  header: { fontSize: 32, marginBottom: 20, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    padding: 10,
    borderRadius: 6,
  },
});
