import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Card from '@/components/Card';
import { useApi } from '@/hooks/useAPI';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useRouter } from 'expo-router';
import CardSpace from '@/components/CardSpace';

export default function BankAccountScreen() {
  type Space = {
    id: number;
    name: string;
    is_default: boolean;
    color: string;
    balance: number;
    goal_balance: number;
  };

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const { loadNames } = useAuthStore();
  useEffect(() => {
    const loadSavedInputs = async () => {
      const { firstname, lastname } = await loadNames();
      if (firstname) setFirstname(firstname);
      if (lastname) setLastname(lastname);
    };
    loadSavedInputs();
  }, []);

  const {
    data: account,
    loading: accountsLoading,
    error: accountsError,
  } = useApi('http://localhost:3000/account', {}, "account");

  const router = useRouter();
  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Konten</Text>
        </View>
      }
    >
      <View style={styles.container}>
        <Text style={styles.title}>{("Willkommen, " + firstname + " " + lastname + "!")}</Text>

        {accountsLoading && <ActivityIndicator size="large" />}
        {accountsError && <Text style={styles.errorText}>{accountsError}</Text>}
        {!accountsLoading &&
          !accountsError &&
          <Card
            id={0}
            title={account.account.name}
            amount={account.account.balance}
            color="#F4A986"
            onPress={() => router.push(`/detail/${account.account.id}`)}
          /> 
          }
        {!accountsLoading &&
          !accountsError && account.spaces.map((spaces: Space) => (
            <CardSpace
              key={spaces.id}
              title={spaces.name}
              amount={spaces.balance}
              color={spaces.color}
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
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
