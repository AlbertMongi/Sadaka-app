import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://192.168.100.24:8000/api/contributions/user');
        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map(item => {
            const dateObj = new Date(); // Replace with actual timestamp if available
            return {
              id: item.id,
              date: String(dateObj.getDate()).padStart(2, '0'),
              month: dateObj.toLocaleString('default', { month: 'short' }),
              title: 'Contribution',
              description: item.purpose || 'No purpose given',
              amount: item.amount,
              type: 'Credit',
              status: 'Completed',
            };
          });
          setTransactions(mapped);
        } else {
          Alert.alert('Error', json.message || 'Failed to load transactions.');
        }
      } catch (error) {
        Alert.alert('Error', 'Could not fetch data. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter(txn =>
    `${txn.title} ${txn.description}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const closeModal = () => setSelectedTxn(null);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#FF8C00" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Transaction History</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
            <TextInput
              placeholder="Search transactions"
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
          </View>

          {/* Loader */}
          {loading ? (
            <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={filteredTransactions}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 40 }}
              ListEmptyComponent={
                <Text style={styles.noResults}>No transactions found.</Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => setSelectedTxn(item)}>
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Text style={styles.monthText}>{item.month}</Text>
                  </View>
                  <View style={styles.info}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                    <Text style={styles.type}>{item.type}</Text>
                    <Text style={styles.status}>Status: {item.status}</Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text
                      style={[
                        styles.amount,
                        { color: item.amount >= 0 ? '#0a8a00' : '#d32f2f' },
                      ]}
                    >
                      {item.amount >= 0 ? '+' : '-'}Tz{Math.abs(item.amount)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Modal */}
          <Modal
            visible={!!selectedTxn}
            animationType="slide"
            transparent
            onRequestClose={closeModal}
          >
            <Pressable style={styles.modalOverlay} onPress={closeModal}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Transaction Details</Text>
                <Text style={styles.modalLabel}>Title:</Text>
                <Text style={styles.modalText}>{selectedTxn?.title}</Text>

                <Text style={styles.modalLabel}>Description:</Text>
                <Text style={styles.modalText}>{selectedTxn?.description}</Text>

                <Text style={styles.modalLabel}>Date:</Text>
                <Text style={styles.modalText}>
                  {selectedTxn?.date} {selectedTxn?.month}
                </Text>

                <Text style={styles.modalLabel}>Type:</Text>
                <Text style={styles.modalText}>{selectedTxn?.type}</Text>

                <Text style={styles.modalLabel}>Status:</Text>
                <Text style={styles.modalText}>{selectedTxn?.status}</Text>

                <Text style={styles.modalLabel}>Amount:</Text>
                <Text
                  style={[
                    styles.modalText,
                    { color: selectedTxn?.amount >= 0 ? '#0a8a00' : '#d32f2f' },
                  ]}
                >
                  {selectedTxn?.amount >= 0 ? '+' : '-'}Tz{Math.abs(selectedTxn?.amount)}
                </Text>
              </View>
            </Pressable>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FF8C00',
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#000',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 24,
    color: '#999',
    fontSize: 13,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  dateBadge: {
    backgroundColor: '#FF8C00',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    width: 50,
  },
  dateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  monthText: {
    color: '#fff',
    fontSize: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  type: {
    fontSize: 11,
    color: '#444',
    fontStyle: 'italic',
  },
  status: {
    fontSize: 11,
    color: '#FF8C00',
    fontWeight: '600',
    marginTop: 2,
  },
  amountContainer: {
    minWidth: 70,
    alignItems: 'flex-end',
  },
  amount: {
    fontWeight: '700',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#FF8C00',
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 10,
    color: '#333',
  },
  modalText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});
