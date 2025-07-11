import { useRouter } from "expo-router";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useApi } from "@/hooks/useAPI";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Card from "@/components/Card";

export default function AccountDetailScreen() {

  const {
    data: account,
    loading: accountLoading,
    error: accountError,
  } = useApi('http://localhost:3000/account');

  if (accountLoading) return <ActivityIndicator />;
  if (accountError) return <Text>{accountError}</Text>;
  if (!account) return <Text>Kein Konto gefunden</Text>;

  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Details</Text>
        </View>
      }
    >
      <View style={styles.container}>
        {accountLoading && <ActivityIndicator size="large" />}
        {accountError && <Text style={styles.errorText}>{accountError}</Text>}
        {!accountLoading &&
          !accountError &&
          <Card
            id={0}
            title={account.account.name}
            amount={account.account.balance}
            color="#F4A986"
            onPress={() => console.log("Detail")}
          /> 
          }
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