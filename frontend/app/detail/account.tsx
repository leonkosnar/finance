import { StyleSheet, View, Text, ActivityIndicator, TextInput, ScrollView, Alert, Button, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useApi } from "@/hooks/useAPI";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Card from "@/components/Card";
import BudgetBar from "@/components/BudgetBar";
import { useApiMutation } from "@/hooks/useAPIMutation";
import { AntDesign } from "@expo/vector-icons";

export default function AccountDetailScreen() {
  const { mutate } = useApiMutation();
  const [budgetEditOpen, setBudgetEditOpen] = useState(false);
  const handleSaveBudgets = async () => {
    const { error } = await mutate("http://localhost:3000/budgets", "POST", {
      categories: editableBudgets,
    });

    if (error) {
      Alert.alert("Fehler", error);
    } else {
      Alert.alert("Erfolg", "Budgets wurden aktualisiert.");
    }
  };
  
  const {
    data: account,
    loading: accountLoading,
    error: accountError,
  } = useApi("http://localhost:3000/account", {}, "account", false);

  const [editableBudgets, setEditableBudgets] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    if (account?.account?.category_max) {
      setEditableBudgets(account.account.category_max);
    }
  }, [account]);

  if (accountLoading) return <ActivityIndicator />;
  if (accountError) return <Text>{accountError}</Text>;
  if (!account) return <Text>Kein Konto gefunden</Text>;

  const budgetStats: { [key: string]: number } = {};
  account.account.stats?.forEach((stat: any) => {
    budgetStats[stat.tag] = Math.abs(stat.volume);
  });

  return (
    <ParallaxScrollView
      headerImage={
        <View style={styles.headerImageContainer}>
          <Text style={styles.headerText}>Details</Text>
        </View>
      }
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{("Alle Finanzen auf einem Blick!")}</Text>
        <Text style={styles.sectionTitle}>Konto im Detail</Text>
        <Card
          id={0}
          title={account.account.name}
          amount={account.account.balance}
          color="#F4A986"
          onPress={() => {}}
        />
        <Text style={styles.sectionTitle}>Budgetübersicht</Text>
        {Object.entries(editableBudgets)
          .filter(([_, max]) => max > 0)
          .map(([tag, max]) => {
            const spent = budgetStats[tag] || 0;
            return (
              <BudgetBar key={tag} tag={tag} max={max} spent={spent} color="#F4A986"/>
            );
          })}

        <Pressable style={styles.sectionHeader} onPress={() => setBudgetEditOpen(!budgetEditOpen)}>
          <Text style={styles.sectionTitle}>Budgets bearbeiten</Text>
          <AntDesign name={budgetEditOpen ? 'up' : 'down'} size={18} color="#333" />
        </Pressable>

        {budgetEditOpen && (
          <>
            {Object.entries(editableBudgets).map(([tag, value]) => (
              <View key={tag} style={styles.budgetRow}>
                <Text style={styles.budgetTag}>{tag}</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={String(value)}
                  onChangeText={(text) => {
                    const parsed = parseFloat(text);
                    setEditableBudgets((prev) => ({
                      ...prev,
                      [tag]: isNaN(parsed) ? 0 : parsed,
                    }));
                  }}
                />
              </View>
            ))}
            <Pressable style={styles.button} onPress={handleSaveBudgets}>
              <Text style={styles.buttonText}>Budgets speichern</Text>
            </Pressable>
          </>
        )}
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
    gap: 20,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  budgetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  budgetTag: {
    flex: 1,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333'
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 4,
    width: 80,
    textAlign: "right",
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A2E3D',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#3BA8A0',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignSelf: 'center',
    marginVertical: 10
  },
  buttonText: {
    color: '#FAF6E1',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0B3043',
  },
});
