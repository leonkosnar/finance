import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useApi } from "@/hooks/useAPI";

type Props = {
  id: number;
  title: string;
  amount: number;
  color: string;
};

export default function AccountCard({ id, title, amount, color }: Props) {
  const {
    data: transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useApi(`http://localhost:3000/transactions?limit=4&offset=0&account=${id}`);
  
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardAmount}>{amount} €</Text>
      </View>
      <View style={styles.cardBody}>
        {transactionsLoading && <ActivityIndicator size="large" />}
        {transactionsError && (
          <Text style={{ color: "red" }}>{transactionsError}</Text>
        )}
        {!transactionsLoading &&
          !transactionsError &&
          transactions.map(
            (
              transaction: {
                destination_name: string;
                source_name: string;
                payment_ref: string;
                amount: number;
              },
              index: React.Key
            ) => {
              const incoming = transaction.destination_name == title;
              // transaction: {
              // "transaction_id": 100,
              // "amount": 25.2,
              // "timestamp": "2025-07-27T02:52:45.433Z",
              // "payment_ref": "ÖH-Beitrag",
              // "source_name": "Girokonto",
              // "destination_name": "Uni Wien"}
              return (
                <View key={index} style={styles.entryRow}>
                  <Text>
                    {incoming
                      ? transaction.source_name
                      : transaction.destination_name}
                  </Text>
                  <Text>{transaction.payment_ref}</Text>
                  <Text
                    style={incoming ? { color: "green" } : { color: "red" }}
                  >
                    {transaction.amount}
                  </Text>
                </View>
              );
            }
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "column",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    alignSelf: "flex-end",
  },
  cardBody: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 8,
  },
  entryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
});
