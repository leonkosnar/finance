import { StyleSheet, View, TextInput, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import HeaderTitle from '@/components/HeaderTitle';

export default function AccountScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#55B86F', dark: '#55B86F' }}
      headerImage={<HeaderTitle title="Account" />}
    >
      <View style={styles.container}>
        <TextInput style={styles.input} value="maximilian.muster@gmail.com" />
        <TextInput style={styles.input} value="abcdefg" secureTextEntry />
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
