import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
};

export default function HeaderTitle({ title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 0,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
