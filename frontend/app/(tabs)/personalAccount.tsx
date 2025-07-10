import { StyleSheet, View, TextInput, Text, Button } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import HeaderTitle from '@/components/HeaderTitle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export default function PersonalAccountScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#55B86F', dark: '#55B86F' }}
      headerImage={<HeaderTitle title="Account" />}
    >
      <View style={styles.container}>
        <TextInput style={styles.input} value="maximilian.muster@gmail.com" />
        <TextInput style={styles.input} value="abcdefg" secureTextEntry />

        <Button title="Logout" onPress={async () => {
          await AsyncStorage.removeItem('loggedIn');
          router.replace('/login');
        }} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingVertical: 16,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'black',
    fontSize: 16,
  },
});
