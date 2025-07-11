import React, { useEffect, useState } from 'react';
import {
  Text, TextInput, StyleSheet, Alert,
  Pressable, Image, View
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [bankPassword, setBankPassword] = useState('');
  const { login, loadUserInputs } = useAuthStore();
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
    }
  };

  useEffect(() => {
    const loadSavedInputs = async () => {
      const { username, bankPassword } = await loadUserInputs();
      if (username) setUsername(username);
      if (bankPassword) setBankPassword(bankPassword);
    };
    loadSavedInputs();
  }, []);

  return (
    <LinearGradient
      colors={['#FAF6E1', '#B7D5C4']}
      style={styles.container}
    >
      <Image
        source={require('../assets/images/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry
      />

      <TextInput
        placeholder="Bank Password"
        value={bankPassword}
        onChangeText={setBankPassword}
        style={styles.input}
        autoCapitalize="none"
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A2E3D',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    opacity: 0.85,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#B7D5C4',
  },
  button: {
    backgroundColor: '#3BA8A0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 10
  },
  buttonText: {
    color: '#FAF6E1',
    fontSize: 18,
    fontWeight: '600',
  },
});
