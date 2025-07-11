import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useApi } from "@/hooks/useAPI";

type Props = {
  id: number;
  title: string;
  amount: number;
  color: string;
  onPress?: () => void;
};

const PAGE_SIZE = 3;

export default function AccountCard({ id, title, amount, color, onPress }: Props) {
  const [offset, setOffset] = useState(0);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: transactions,
    loading: transactionsLoading,
    error: transactionsError,
  } = useApi(
    `http://localhost:3000/transactions?limit=${PAGE_SIZE}&offset=${offset}&account=${id}`,
    {},
    `transactions`,
    offset > 0
  );

  useEffect(() => {
    if (transactions && Array.isArray(transactions)) {
      if (transactions.length < PAGE_SIZE) {
        setHasMore(false);
      }
      setAllTransactions((prev) =>
        offset === 0 ? transactions : [...prev, ...transactions]
      );
    }
  }, [transactions]);

  const handleLoadMore = () => {
    setOffset((prev) => prev + PAGE_SIZE);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: color }]}
    >
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.amount}>{amount.toFixed(2)} €</Text>
        </View>

        <View style={styles.body}>
          {transactionsLoading && offset === 0 && <ActivityIndicator size="small" />}
          {transactionsError && <Text style={styles.error}>{transactionsError}</Text>}

          {allTransactions.map((tx, index) => {
            const isPositive = tx.amount > 0;
            return (
              <View key={index} style={styles.transactionRow}>
                <View style={styles.left}>
                  <Text style={styles.label}>{tx.second_party}</Text>
                  <Text style={styles.subLabel}>{tx.tag}</Text>
                </View>
                <Text
                  style={[
                    styles.amountValue,
                    isPositive ? styles.incoming : styles.outgoing,
                  ]}
                >
                  {isPositive ? "+" : ""}
                  {tx.amount.toFixed(2)} €
                </Text>
              </View>
            );
          })}

          {hasMore && !transactionsLoading && (
            <TouchableOpacity onPress={handleLoadMore}>
              <Text style={{ color: "#007AFF", textAlign: "center", marginTop: 8 }}>
                Mehr laden
              </Text>
            </TouchableOpacity>
          )}

          {transactionsLoading && offset > 0 && (
            <ActivityIndicator size="small" style={{ marginTop: 8 }} />
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
