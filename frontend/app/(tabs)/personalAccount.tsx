import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function PersonalAccountScreen() {
  const [infoOpen, setInfoOpen] = useState(true);
  const [pwOpen, setPwOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
   const { logout } = useAuthStore();

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
            <TextInput
              style={styles.input}
              value="maximilian.muster@gmail.com"
              editable={false}
            />
          </View>
        )}

        <Pressable style={styles.sectionHeader} onPress={() => setPwOpen(!pwOpen)}>
          <Text style={styles.sectionTitle}>Passwort ändern</Text>
          <AntDesign name={pwOpen ? 'up' : 'down'} size={18} color="#333" />
        </Pressable>
        {pwOpen && (
          <View style={styles.sectionContent}>
            <TextInput
              style={styles.input}
              value="abcdefg"
              secureTextEntry
              editable={false}
            />
          </View>
        )}

        <Pressable style={styles.sectionHeader} onPress={() => setLogoutOpen(!logoutOpen)}>
          <Text style={styles.sectionTitle}>Logout</Text>
          <AntDesign name={logoutOpen ? 'up' : 'down'} size={18} color="#333" />
        </Pressable>
        {logoutOpen && (
          <View style={styles.sectionContent}>
            <Pressable style={styles.button} onPress={async () => {
              await logout();
              router.replace('/login');
            }}>
              <Text style={styles.buttonText}>Logout</Text>
            </Pressable>
          </View>
        )}
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
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#B7D5C4',
    gap: 12,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#B7D5C4',
  },
  button: {
    backgroundColor: '#3BA8A0',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FAF6E1',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

