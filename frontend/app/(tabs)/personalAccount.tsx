import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function PersonalAccountScreen() {
  const [infoOpen, setInfoOpen] = useState(true);
  const [pwOpen, setPwOpen] = useState(false);
  const { logout } = useAuthStore();

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const { loadNames } = useAuthStore();
  useEffect(() => {
    const loadSavedInputs = async () => {
      const { firstname, lastname, username } = await loadNames();
      if (firstname) setFirstname(firstname);
      if (lastname) setLastname(lastname);
      if (username) setUsername(username);
    };
    loadSavedInputs();
  }, []);

  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Benutzer</Text>
        </View>
      }
    >
      <View style={styles.container}>
        <Pressable style={styles.sectionHeader} onPress={() => setInfoOpen(!infoOpen)}>
          <Text style={styles.sectionTitle}>Persönliche Informationen</Text>
          <AntDesign name={infoOpen ? 'up' : 'down'} size={18} color="#333" />
        </Pressable>
        {infoOpen && (
          <View style={styles.sectionContent}>
            <Text style={{ fontWeight: '600', color: '#0B3043', margin: 4}}>Vorname</Text>
            <TextInput
              style={styles.input}
              value={firstname}
              editable={false}
            />

            <Text style={{ fontWeight: '600', color: '#0B3043', margin: 4}}>Nachname</Text>
            <TextInput
              style={styles.input}
              value={lastname}
              editable={false}
            />

            <Text style={{ fontWeight: '600', color: '#0B3043', margin: 4}}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              editable={false}
            />
          </View>
        )}

        {/* <Pressable style={styles.sectionHeader} onPress={() => setPwOpen(!pwOpen)}>
          <Text style={styles.sectionTitle}>Passwort ändern</Text>
          <AntDesign name={pwOpen ? 'up' : 'down'} size={18} color="#333" />
        </Pressable>
        {pwOpen && (
          <View style={styles.sectionContent}>
            <Text style={{ fontWeight: '600', color: '#0B3043', margin: 4}}>Passwort</Text>
            <TextInput
              style={styles.input}
              value="abcdefg"
              secureTextEntry
              editable={false}
            />
          </View>
        )} */}
        
        <Pressable style={styles.button} onPress={async () => {
          await logout();
          router.replace('/login');
        }}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 0,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0A2E3D',
  },
  container: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B3043',
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginBottom: 12,
    gap: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#B7D5C4',
  },
  button: {
    backgroundColor: '#3BA8A0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    marginVertical: 10
  },
  buttonText: {
    color: '#FAF6E1',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});
