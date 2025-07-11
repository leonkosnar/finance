import { useRouter } from "expo-router";
import { StyleSheet, View, Text, ActivityIndicator, Button, Modal, TouchableOpacity, FlatList, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useApi } from "@/hooks/useAPI";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CardSpace from "@/components/CardSpace";
import { useLocalSearchParams } from "expo-router";
import { useApiMutation } from '@/hooks/useAPIMutation';

export default function AccountDetailScreen() {
  const { id } = useLocalSearchParams();
  const {
    data: space,
    loading: spaceLoading,
    error: spaceError,
    refetch: refetchSpace,
  } = useApi(`http://localhost:3000/space/${id}`);

  const {
    data: allSpaces,
    loading: allSpacesLoading,
    error: allSpacesError,
  } = useApi(`http://localhost:3000/spaces`);

  const [modalVisible, setModalVisible] = useState(false);
  const [targetSpaceId, setTargetSpaceId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [isMoving, setIsMoving] = useState(false);
  const { mutate } = useApiMutation();

  if (spaceLoading || allSpacesLoading) return <ActivityIndicator />;
  if (spaceError) return <Text>{spaceError}</Text>;
  if (allSpacesError) return <Text>{allSpacesError}</Text>;
  if (!space) return <Text>Kein Space gefunden</Text>;

  const targetSpaces = allSpaces.filter((s: any) => s.id !== Number(id));

  const doTransfer = async () => {
    if (!targetSpaceId) {
      alert("Bitte Zielkonto wählen!");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Bitte gültigen Betrag eingeben!");
      return;
    }

    setIsMoving(true);
    const { data, error } = await mutate("http://localhost:3000/move", "POST", {
      src: Number(id),
      dst: targetSpaceId,
      amt: Number(amount),
    });

    setIsMoving(false);

    if (error) {
      alert(`Fehler bei Überweisung: ${error}`);
      return;
    }

    alert("Überweisung erfolgreich!");
    setModalVisible(false);
    setAmount("");
    setTargetSpaceId(null);
    refetchSpace();
  };

  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Space</Text>
        </View>
      }
    >
      <View style={styles.container}>
        <CardSpace
          space={space}
          display_rules={true}
          onPress={() => console.log("Detail")}
        />

        <Button title="Geld Überweisen" onPress={() => setModalVisible(true)} />

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Überweisung</Text>

              <Text>Zielkonto wählen:</Text>
              <FlatList
                data={targetSpaces}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.spaceItem,
                      targetSpaceId === item.id && styles.selectedSpaceItem,
                    ]}
                    onPress={() => setTargetSpaceId(item.id)}
                  >
                    <Text>{item.name}</Text>
                    <Text>Balance: {item.balance}</Text>
                  </TouchableOpacity>
                )}
              />

              <Text>Betrag:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Betrag eingeben"
              />

              <View style={styles.buttonRow}>
                <Button
                  title="Abbrechen"
                  onPress={() => {
                    setModalVisible(false);
                    setAmount("");
                    setTargetSpaceId(null);
                  }}
                />
                <Button
                  title={isMoving ? "Überweise..." : "Überweisen"}
                  onPress={doTransfer}
                  disabled={isMoving}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
  errorText: {
    color: "red",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  spaceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  selectedSpaceItem: {
    backgroundColor: "#ddd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 8,
    marginTop: 5,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
