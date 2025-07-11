import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { useApiMutation } from '@/hooks/useAPIMutation';
import { useRouter } from 'expo-router';
import WheelColorPicker from 'react-native-wheel-color-picker';
import ParallaxScrollView from '@/components/ParallaxScrollView';

export default function CreateSpaceScreen() {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#F4A986');
  const [goal, setGoal] = useState('');
  const { mutate } = useApiMutation();
  const router = useRouter();

  const handleCreate = async () => {
    const { error } = await mutate(
      'http://localhost:3000/spaces',
      'POST',
      {
        name,
        color,
        goal_balance: parseFloat(goal) || 0,
      }
    );

    if (error) {
      Alert.alert('Fehler', error);
    } else {
      router.replace('/(tabs)/bankAccount');
    }
  };

  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Space erstellen</Text>
        </View>
      }
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Space-Details</Text>

        <Text style={styles.label}>Name des Space</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="z.B. Urlaub"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Zielbetrag (€)</Text>
        <TextInput
          value={goal}
          onChangeText={setGoal}
          keyboardType="numeric"
          style={styles.input}
          placeholder="z.B. 1000"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Farbe wählen</Text>
        <View style={styles.pickerWrapper}>
          <WheelColorPicker
            onColorChangeComplete={setColor}
            sliderHidden 
          />
        </View>

        <Pressable style={[styles.button]} onPress={handleCreate}>
          <Text style={styles.buttonText}>Space erstellen</Text>
        </Pressable>
      </ScrollView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 0,
    alignItems: "flex-start",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0A2E3D",
  },
  container: {
    gap: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  pickerWrapper: {
    alignItems: 'center',
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
