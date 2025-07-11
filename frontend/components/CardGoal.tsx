import React from "react";
import { View, Text, StyleSheet } from "react-native";
import * as Progress from 'react-native-progress';

type Props = {
  title: string;
  amount: number | string;
  goalAmount: number | string;
  color: string;
};

export default function GoalsCard({ title, amount, goalAmount, color }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.amount}>{amount} €</Text>
        <View style={styles.body}>
          <Progress.Bar
            width={200}
            height={28}
            progress={0.5}
            color={color}
            unfilledColor="#E0E0E0"
            borderWidth={0}
          />
          <Text style={styles.subtitle}>Ziel: {goalAmount}</Text>
        </View>
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
