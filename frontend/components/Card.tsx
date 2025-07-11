import React from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useApi } from "@/hooks/useAPI";

type Props = {
  id: number;
  title: string;
  amount: number;
  color: string;
  onPress?: () => void;
};

export default function AccountCard({ id, title, amount, color, onPress }: Props) {
  const {
    data: transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useApi(`http://localhost:3000/transactions?limit=4&offset=0&account=${id}`);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: color }]}
    >
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>{amount} €</Text>
        </View>
        <View style={styles.body}>
          {transactionsLoading && <ActivityIndicator size="small" />}
          {transactionsError && (
            <Text style={styles.error}>{transactionsError}</Text>
          )}
          {!transactionsLoading &&
            !transactionsError &&
            transactions.map(
              (
                tx: {
                  second_party: string;
                  tag: string;
                  amount: number;
                },
                index: React.Key
              ) => {
                const negative = amount < 0;
                return (
                  <View key={index} style={styles.transactionRow}>
                    <View style={styles.left}>
                      <Text style={styles.label}>{tx.second_party}</Text>
                      <Text style={styles.subLabel}>{tx.tag}</Text>
                    </View>
                    <Text style={[
                        styles.amountValue,
                        negative ? styles.incoming : styles.outgoing,
                      ]}
                    >
                      {negative ? '+' : '-'}{tx.amount.toFixed(2)} €
                    </Text>
                  </View>
                );
              }
            )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "column",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "left"
  },
  amount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "right",
    marginBottom: 10,
  },
  body: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "column",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  subLabel: {
    fontSize: 12,
    color: "#888",
  },
  amountValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  incoming: {
    color: "#2e7d32", // Grün
  },
  outgoing: {
    color: "#c62828", // Rot
  },
  error: {
    color: "red",
    fontSize: 14,
  },
});
