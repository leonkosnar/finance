import { View, Text, StyleSheet } from 'react-native';

type Entry = {
  label: string;
  value: string;
};

type Props = {
  title: string;
  amount: string;
  entries: Entry[];
  color: string;
};

export default function AccountCard({ title, amount, entries, color }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: color }]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardAmount}>{amount}</Text>
      </View>
      <View style={styles.cardBody}>
        {entries.map((entry, index) => (
          <View key={index} style={styles.entryRow}>
            <Text>{entry.label}</Text>
            <Text>{entry.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  cardAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    alignSelf: 'flex-end'
  },
  cardBody: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 8,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
});
