import { Rule, Space } from "@/constants/types";
import { useApi } from "@/hooks/useAPI";
import { useAuthStore } from "@/hooks/useAuthStore";
import { TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";

type Props = {
  space: Space;
  display_rules: boolean;
  onPress?: () => void;
};

export default function SpaceCard({
  space,
  onPress,
  display_rules = false,
}: Props) {
  const token = useAuthStore().token;
  const {
    data: rules,
    loading: rulesLoading,
    error: rulesError,
  } = useApi(`http://localhost:3000/rules?space_id=${space.id}`);

  const deleteRule = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/rule/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete rule");
      }
    } catch (err) {
      console.error(err);
      // Show error to user?
    }
  };

  const [selectedTag, setSelectedTag] = useState("Essen und Trinken");
  const [percentage, setPercentage] = useState("");

  // You can replace this list with a shared constant if needed
  const tags = [
    "Reisen",
    "Essen und Trinken",
    "Shopping",
    "Multimedia",
    "Freizeit",
    "Bildung",
    "Online Shopping",
    "Steuern",
    "Überweisung",
    "Nutzer",
    "Gehalt",
    "Andere",
  ];

  const addRule = async () => {
    if (!percentage) return alert("Bitte Prozentsatz eingeben.");

    try {
      const res = await fetch(`http://localhost:3000/rule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tag: selectedTag,
          percentage: parseInt(percentage),
          space_id: space.id,
        }),
      });

      console.log(res)
      if (!res.ok) throw new Error("Fehler beim Erstellen der Regel");

      setPercentage("");
      // You should trigger a refetch here if you add it to `useApi`
    } catch (err) {
      console.error(err);
      alert("Erstellen fehlgeschlagen");
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.card, { backgroundColor: space.color }]}
    >
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{space.name}</Text>
          <Text style={styles.amount}>{space.balance.toFixed(2)} €</Text>
        </View>
        <View style={styles.body}>
          {rulesLoading && <ActivityIndicator size="small" />}
          {rulesError && <Text style={styles.error}>{rulesError}</Text>}
          {!rulesLoading &&
            !rulesError &&
            (display_rules ? (
              (rules.rules as Rule[]).map((rule: Rule, index: React.Key) => {
                return (
                  <View key={index} style={styles.transactionRow}>
                    <View style={styles.transaction}>
                      <Text>
                        [{rule.tag}] Transaktionen werden zu [{rule.percentage}
                        %] diesen Space zugewiesen.
                      </Text>
                      <Button
                        onPress={() => deleteRule(rule.id)}
                        title="Löschen"
                      />
                    </View>
                  </View>
                );
              })
            ) : (
              <Text>
                {rules.rules.length} Regel{rules.rules.length != 1 && "n"}
              </Text>
            ))}
        </View>
      </View>
      {display_rules && (
        <View>
          <View style={{ width: "100%", paddingVertical: 10, backgroundColor: "white" }}>
            <Text>Tag auswählen:</Text>
            <Picker
              selectedValue={selectedTag}
              onValueChange={(itemValue: string) => setSelectedTag(itemValue)}
            >
              {tags.map((tag) => (
                <Picker.Item key={tag} label={tag} value={tag} />
              ))}
            </Picker>

            <Text>Prozentsatz (%):</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="z. B. 25"
              value={percentage}
              onChangeText={setPercentage}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                padding: 8,
                marginBottom: 8,
              }}
            />

            <Button title="Regel speichern" onPress={addRule} />
          </View>
        </View>
      )}
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
    textAlign: "left",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#000000",
    textAlign: "left",
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
    alignItems: "center",
  },
  transactionRow: {
    flexDirection: "row",
    gap: "20",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transaction: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  left: {
    flexDirection: "column",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
});
