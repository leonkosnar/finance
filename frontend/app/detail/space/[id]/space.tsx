import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Button,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useApi } from "@/hooks/useAPI";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import CardSpace from "@/components/CardSpace";
import { useLocalSearchParams } from "expo-router";
import { useApiMutation } from "@/hooks/useAPIMutation";

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
  if (spaceError) return <Text style={styles.errorText}>{spaceError}</Text>;
  if (allSpacesError) return <Text style={styles.errorText}>{allSpacesError}</Text>;
  if (!space) return <Text style={styles.errorText}>Kein Space gefunden</Text>;

  const targetSpaces = allSpaces.filter((s: any) => s.id !== Number(id));

  const doTransfer = async () => {
    if (!targetSpaceId) {
      Alert.alert("Fehler", "Bitte Zielkonto wählen!");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Fehler", "Bitte gültigen Betrag eingeben!");
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
      Alert.alert("Fehler bei Überweisung", error);
      return;
    }

    Alert.alert("Erfolg", "Überweisung erfolgreich!");
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
      <ScrollView contentContainerStyle={styles.container}>
        <CardSpace
          space={space}
          display_rules={true}
          onPress={() => {}}
        />

        <Pressable
          style={styles.primaryButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.primaryButtonText}>Geld Überweisen</Text>
        </Pressable>

        <Modal visible={modalVisible} animationType="fade" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Überweisung</Text>

              <Text style={styles.label}>Zielkonto wählen:</Text>
              <FlatList
                data={targetSpaces}
                keyExtractor={(item) => item.id.toString()}
                style={{ maxHeight: 250, marginBottom: 15 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.spaceItem,
                      targetSpaceId === item.id && styles.selectedSpaceItem,
                    ]}
                    onPress={() => setTargetSpaceId(item.id)}
                  >
                    <Text style={styles.spaceName}>{item.name}</Text>
                    <Text style={styles.spaceBalance}>Balance: {item.balance}</Text>
                  </TouchableOpacity>
                )}
              />

              <Text style={styles.label}>Betrag:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                placeholder="Betrag eingeben"
              />

              <View style={styles.buttonRow}>
                <Pressable
                  style={[styles.secondaryButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setAmount("");
                    setTargetSpaceId(null);
                  }}
                >
                  <Text style={styles.secondaryButtonText}>Abbrechen</Text>
                </Pressable>

                <Pressable
                  style={[styles.primaryButton, isMoving && styles.disabledButton]}
                  onPress={doTransfer}
                  disabled={isMoving}
                >
                  <Text style={styles.primaryButtonText}>
                    {isMoving ? "Überweise..." : "Überweisen"}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  primaryButton: {
    backgroundColor: "#3BA8A0",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryButtonText: {
    color: "#FAF6E1",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#ccc",
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  secondaryButtonText: {
    color: "#444",
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#0A2E3D",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#0B3043",
    fontWeight: "600",
  },
  spaceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  selectedSpaceItem: {
    backgroundColor: "#F4A98620",
  },
  spaceName: {
    fontSize: 16,
    color: "#0A2E3D",
  },
  spaceBalance: {
    fontSize: 14,
    color: "#3BA8A0",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
