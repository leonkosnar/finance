import { useRouter } from "expo-router";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useApi } from "@/hooks/useAPI";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Card from "@/components/Card";
import { Space } from "@/constants/types";
import CardSpace from "@/components/CardSpace";
import { useLocalSearchParams } from "expo-router";

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams();
  const {
    data: space,
    loading: spaceLoading,
    error: spaceError,
  } = useApi(`http://localhost:3000/space/${id}`);

  if (spaceLoading) return <ActivityIndicator />;
  if (spaceError) return <Text>{spaceError}</Text>;
  if (!space) return <Text>Kein Space gefunden</Text>;

  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Space</Text>
        </View>
      }
    >
      {spaceLoading && <ActivityIndicator size="large" />}
      {spaceError && <Text style={styles.errorText}>{spaceError}</Text>}
      {!spaceLoading && !spaceError && (
        <View style={styles.container}>
          <CardSpace
            space={space}
            display_rules={true}
            onPress={() => console.log("Detail")}
          />
        </View>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImageContainer: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 0,
    alignItems: "flex-start",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0A2E3D",
  },
  container: {
    gap: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0A2E3D",
    marginBottom: 20,
    textAlign: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
});
