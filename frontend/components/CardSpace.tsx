import { Rule, Space } from "@/constants/types";
import { useApi } from "@/hooks/useAPI";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Pressable, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
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
    data: rulesData,
    loading: rulesLoading,
    error: rulesError,
    refetch,
  } = useApi<{ rules: Rule[] }>(`http://localhost:3000/rules?space_id=${space.id}`);

  const [selectedTag, setSelectedTag] = useState("Essen und Trinken");
  const [percentage, setPercentage] = useState("");

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

  const deleteRule = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:3000/rule/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete rule");

      await refetch(); // refetch rules after delete
    } catch (err) {
      console.error(err);
      alert("Regel löschen fehlgeschlagen");
    }
  };

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

      if (!res.ok) throw new Error("Fehler beim Erstellen der Regel");

      setPercentage("");
      await refetch(); // refetch rules after adding
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
          {rulesError && (
            <Text style={styles.error}>
              {typeof rulesError === "string"
                ? rulesError
                : "Fehler beim Laden der Regeln"}
            </Text>
          )}
          {!rulesLoading && !rulesError && (
            <>
              {display_rules ? (
                rulesData?.rules.length ? (
                  rulesData.rules.map((rule) => (
                    <View key={rule.id} style={styles.transactionRow}>
                      <View style={styles.transaction}>
                        <Text>
                          [{rule.tag}] Transaktionen werden zu [{rule.percentage}%] diesem Space zugewiesen.
                        </Text>
                        <Pressable onPress={() => deleteRule(rule.id)}>
                          <Text style={styles.buttonText}>Löschen</Text>
                        </Pressable>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={styles.label}>Keine Regeln vorhanden.</Text>
                )
              ) : (
                <Text style={styles.label}>
                  {rulesData?.rules.length ?? 0} Regel{rulesData?.rules.length !== 1 ? "n" : ""}
                </Text>
              )}
            </>
          )}
        </View>
      </View>

      {display_rules && (
        <View style={styles.addRuleContainer}>
          <Text style={styles.label}>Tag auswählen:</Text>
          <Picker
            selectedValue={selectedTag}
            onValueChange={(itemValue) => setSelectedTag(itemValue)}
            style={styles.picker}
            dropdownIconColor="#000" // Optional: für bessere Sichtbarkeit
          >
            {tags.map((tag) => (
              <Picker.Item key={tag} label={tag} value={tag} />
            ))}
          </Picker>

          <Text style={styles.label}>Prozentsatz (%):</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="z. B. 25"
            value={percentage}
            onChangeText={setPercentage}
            style={styles.input}
          />

          <Pressable onPress={addRule}>
            <Text style={styles.buttonText}>Regel speichern</Text>
          </Pressable>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    margin: 8,
    color: "#000",
  },
  picker: {
    marginVertical: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginHorizontal: 8,
    fontSize: 16,
  },
  card: {
    borderRadius: 20,
    padding: 16,
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
    marginTop: 10,
    // gap is not supported, use marginBottom on children instead
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transaction: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  addRuleContainer: {
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    marginTop: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#007AFF',
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
