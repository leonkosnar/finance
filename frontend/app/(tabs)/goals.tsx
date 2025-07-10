import React from 'react';
import { View, StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Card from '@/components/Card';
import HeaderTitle from '@/components/HeaderTitle';

export default function GoalsScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#534FA3', dark: '#534FA3' }}
      headerImage={<HeaderTitle title="Goals" />}
    >
      <View style={styles.container}>
        <Card
          title="Level 2. Sparzubi"
          amount=""
          color="#534FA3"
          entries={[]}
        />
        <Card
          title="Sparen für Urlaub"
          amount="5.200,00 €"
          color="#7ED7C1"
          entries={[{ label: 'Ziel: 6.000 € bis Juli', value: '' }]}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
