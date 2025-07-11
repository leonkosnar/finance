import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import CardBadge from '@/components/CardBadge';
import CardGoal from '@/components/CardGoal';
import { useApi } from '@/hooks/useAPI';

export default function GoalsScreen() {
  type Space = {
    id: number;
    name: string;
    is_default: boolean;
    color: string;
    balance: number;
    goal_balance: number;
  };

  const {
    data: spaces,
    loading: spacesLoading,
    error: spacesError,
  } = useApi('http://localhost:3000/spaces', {}, "spaces");

  if (spacesLoading) return <ActivityIndicator />;
  if (spacesError) return <Text>{spacesError}</Text>;
  if (!spaces) return <Text>Kein Konto gefunden</Text>;
  
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
        {!spacesLoading && !spacesError && spaces
          .filter((space: { goal_balance: any; }) => Number(space.goal_balance) > 0)
          .map((space: { id: React.Key | null | undefined; name: string; balance: string | number; goal_balance: string | number; color: string; }) => (
            <CardGoal
              key={space.id}
              title={space.name}
              amount={space.balance}
              goalAmount={space.goal_balance}
              color={space.color}
            />
          ))}
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
