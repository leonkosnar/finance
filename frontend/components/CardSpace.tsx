import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  key: number;
  title: string;
  amount: number;
  color: string;
};

export default function SpaceCard({ title, amount, color }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>{amount.toFixed(2)} €</Text>
      </View>
    </View>
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
  subtitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#000000",
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
    alignItems: 'center'
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    flexDirection: "column",
  },
});
