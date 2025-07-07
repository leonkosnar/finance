import { Image, StyleSheet, View, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Card from '@/components/Card';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#0B3043', dark: '#0B3043' }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Konten</Text>
        </View>
      }
    >
      <View style={styles.container}>
        <Card
          title="Hauptkonto"
          amount="3.072,32 €"
          color="#F3A97D"
          entries={[
            { label: 'Max Mustermann', value: '-364,30 €' },
            { label: 'Lisa Huber', value: '492,00 €' },
            { label: 'Nina Chuba', value: '-615,83 €' },
          ]}
        />
        <Card
          title="Sparen für Urlaub"
          amount="5.200,00 €"
          color="#3EA4A8"
          entries={[
            { label: 'Mai', value: '600,00 €' },
            { label: 'April', value: '600,00 €' },
            { label: 'März', value: '600,00 €' },
          ]}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#A85757',
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerImageContainer: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 0,
    alignItems: 'flex-start',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  container: {
    gap: 8,
  }
});
