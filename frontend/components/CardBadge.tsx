import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';

type Props = {
  title: string;
  color: string;
};

export default function BadgeCard({ title, color }: Props) {

  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.titleRow}>
        <MaterialCommunityIcons
          name="chevron-double-up"
          size={40}
          color="white"
          style={styles.iconBadge}
        />
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>

  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 12,
    gap: 12,
    alignItems: 'center'
  },
  header: {
    flexDirection: "column",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: "center"
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "right"
  },
  body: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 4,
    borderRadius: 999,
  },
});
