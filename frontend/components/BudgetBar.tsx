import { View, Text, StyleSheet } from "react-native";
import React from "react";
import * as Progress from 'react-native-progress';

interface BudgetBarProps {
  tag: string;
  max: number;
  spent: number;
  color: string;
}

export default function BudgetBar({ tag, max, spent, color}: BudgetBarProps) {
  const progress = max > 0 ? Math.min(spent / max, 1) : 0;
  const percent = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{tag}</Text>

      <View style={styles.barRow}>
        <Progress.Bar
            width={240}
            height={20}
            progress={progress}
            color={color}
            unfilledColor="#E0E0E0"
            borderWidth={0}
        />
        <Text style={styles.percent}>{percent}%</Text>
      </View>

      <Text style={styles.amount}>
        {Math.abs(spent)} € von {max} €
      </Text>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0A2E3D",
    marginBottom: 4,
  },
  barBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  barFill: {
    height: 10,
    backgroundColor: "#F4A986",
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  percent: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "right",
    marginLeft: 8,
    width: 40,
  },
  amount: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },
});
