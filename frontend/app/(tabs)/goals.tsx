import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import CardBadge from '@/components/CardBadge';
import CardGoal from '@/components/CardGoal';

export default function GoalsScreen() {
  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Goals</Text>
        </View>
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>{("Sie befinden sich auf dem richtigen Weg!")}</Text>

        <CardBadge
          title="Level 2: Sparzubi"
          color="#534FA3"
        />
        <CardGoal
          title="Sparen für Urlaub"
          amount="5.200,00"
          goalAmount="6.000,00"
          color="#7ED7C1"
        />
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
    gap: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A2E3D',
    marginBottom: 20,
    textAlign: 'center',
  },
});
