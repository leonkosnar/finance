import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import Card from '@/components/Card';
import { useApi } from '@/hooks/useAPI';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useFocusEffect, useRouter } from 'expo-router';
import CardSpace from '@/components/CardSpace';
import { Space } from '@/constants/types';

export default function BankAccountScreen() {

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
    refetch,
  } = useApi('http://localhost:3000/account', {}, "account");

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

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
            onPress={() => router.push(`/detail/account`)}
          /> 
          }
        {!accountsLoading &&
          !accountsError && account.spaces.map((space: Space) => (
            <CardSpace
              key={space.id}
              space={space}
              display_rules={false}
              onPress={() => router.push(`/detail/space/${space.id}/space`)}
            />
          ))}

          <Pressable style={styles.button} onPress={() => router.push('/create/space')}>
            <Text style={styles.buttonText}>Neuen Space anlegen</Text>
          </Pressable>
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
