import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

type Props = {
  title: string;
};

export default function HeaderTitle({ title }: Props) {
  const color = useThemeColor({}, "primary");
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    right: 0,
    alignItems: 'flex-start',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
