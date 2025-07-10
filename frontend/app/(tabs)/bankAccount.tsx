import React from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Card from "@/components/Card";
import { useApi } from "@/hooks/useAPI";

export default function BankAccountScreen() {
  const {
    data: accounts,
    loading: accountsLoading,
    error: accountsError,
  } = useApi("http://localhost:3000/account");

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#0B3043", dark: "#0B3043" }}
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Konten</Text>
        </View>
      }
    >
      <View style={styles.container}>
        {accountsLoading && <ActivityIndicator size="large" />}
        {accountsError && <Text style={{ color: "red" }}>{accountsError}</Text>}
        {!accountsLoading &&
          !accountsError &&
          accounts.map(
            (
              account: {
                id: number;
                user_id: number;
                name: string;
                tag: string;
                balance: number;
                color: string;
              },
              idx: React.Key | null | undefined
            ) => (
              <Card
                key={idx}
                id={account.id}
                title={account.name}
                amount={account.balance}
                color={account.color}
              />
            )
          )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#A85757",
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerImageContainer: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 0,
    alignItems: "flex-start",
  },
  headerText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  container: {
    gap: 8,
  },
});
