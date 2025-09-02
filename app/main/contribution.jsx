import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function GiveScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const scrollRef = useRef(null);

  const [offering, setOffering] = useState('');
  const [frequency, setFrequency] = useState('One time');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Mobile money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [token, setToken] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [funds, setFunds] = useState([{ id: 1, value: 'General Fund' }]);

  const frequencies = ['One time', 'Weekly', 'Monthly', 'Every two weeks'];

  const getHost = () =>
    Platform.OS === 'android' ? 'http://192.168.100.24:8000' : 'http://192.168.100.24:8000';

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('userToken');
      if (savedToken) setToken(savedToken);
      else router.replace('/login');
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchCommunities = async () => {
      try {
        const res = await fetch(`${getHost()}/api/communities/joined`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (res.ok && Array.isArray(json.data)) {
          setJoinedCommunities(json.data);
        }
      } catch (e) {
        console.error('Error loading communities', e);
      }
    };
    fetchCommunities();
  }, [token]);

  const formatAmountWithCommas = (value) => {
    const numericValue = value.replace(/,/g, '').replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return parseInt(numericValue, 10).toLocaleString('en-US');
  };

  const handleAmountChange = (value) => {
    const formatted = formatAmountWithCommas(value);
    setAmount(formatted);
  };

  const addFund = () => {
    const newId = funds.length + 1;
    setFunds([...funds, { id: newId, value: '' }]);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  const sendContribution = async () => {
    if (!offering || !amount || !location) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    const rawAmount = Number(amount.replace(/,/g, ''));
    if (isNaN(rawAmount) || rawAmount <= 0) {
      Alert.alert('Error', 'Enter a valid amount.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${getHost()}/api/contributions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          offerType: offering,
          amount: rawAmount,
          purpose: frequency,
          phoneNo: paymentMethod === 'Mobile money' ? mobileNumber : cardNumber,
          communityId: location,
        }),
      });

      if (!res.ok) throw new Error('Failed to send contribution');
      Alert.alert('Success', 'Thank you! Your contribution has been sent.');
      setShowPaymentModal(false);
      setAmount('');
      setOffering('');
      setLocation('');
      setMobileNumber('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" ref={scrollRef}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#FF8C00" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Give</Text>
          <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={24} color="#FF8C00" />
          </View>
        </View>

        {/* Offering */}
        <Text style={styles.label}>What’s your offering?</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={offering}
            onValueChange={(val) => setOffering(val)}
            style={styles.picker}
            dropdownIconColor="#FF8C00"
          >
            <Picker.Item label="Select..." value="" />
            <Picker.Item label="Tithe" value="Tithe" />
            <Picker.Item label="Missions" value="Missions" />
            <Picker.Item label="General Fund" value="General Fund" />
          </Picker>
        </View>

        {/* Frequency */}
        <Text style={styles.label}>Frequency</Text>
        <FlatList
          data={frequencies}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.frequencyContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.freqButton, frequency === item && styles.freqButtonActive]}
              onPress={() => setFrequency(item)}
            >
              <Text style={[styles.freqText, frequency === item && styles.freqTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Amount */}
        <View style={styles.amountBox}>
          <Text style={styles.currency}>TZS</Text>
          <TextInput
            style={styles.amount}
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#999"
          />
        </View>

        {/* Location */}
        <Text style={styles.label}>Give to</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={location}
            onValueChange={(val) => setLocation(val)}
            style={styles.picker}
            dropdownIconColor="#FF8C00"
          >
            <Picker.Item label="Select..." value="" />
            {joinedCommunities.map((c) => (
              <Picker.Item key={c.id} label={c.name} value={c.id} />
            ))}
          </Picker>
        </View>

        {/* Add Fund Button */}
        {/* <TouchableOpacity style={styles.addFund} onPress={addFund}>
          <Ionicons name="add" size={12} color="#FF8C00" />
          <Text style={styles.addFundText}>Add fund</Text>
        </TouchableOpacity> */}

        {/* Continue Button */}
        <TouchableOpacity style={styles.continueButton} onPress={() => setShowPaymentModal(true)}>
          <Text style={styles.continueText}>Send</Text>
        </TouchableOpacity>

        {/* Payment Modal */}
        <Modal
          visible={showPaymentModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowPaymentModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Choose Payment Method</Text>
            <View style={styles.dropdown}>
              <Picker
                selectedValue={paymentMethod}
                onValueChange={(val) => setPaymentMethod(val)}
                style={styles.picker}
                dropdownIconColor="#FF8C00"
              >
                <Picker.Item label="Mobile money" value="Mobile money" />
                <Picker.Item label="Card payment" value="Card payment" />
              </Picker>
            </View>

            {paymentMethod === 'Mobile money' ? (
              <>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  placeholder="e.g., 0712345678"
                  keyboardType="phone-pad"
                />
              </>
            ) : (
              <>
                <Text style={styles.label}>Card Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Expiry Date</Text>
                <TextInput
                  style={styles.textInput}
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                />

                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.textInput}
                  value={cvv}
                  onChangeText={setCvv}
                  placeholder="123"
                  keyboardType="numeric"
                  secureTextEntry
                />
              </>
            )}

            <TouchableOpacity
              style={[styles.continueButton, { marginTop: 24 }]}
              onPress={sendContribution}
              disabled={loading}
            >
              <Text style={styles.continueText}>{loading ? 'Sending...' : 'Submit'}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    color: '#000',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  picker: {
    height: 40,
    width: '100%',
    color: '#000',
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  freqButton: {
    padding: 8,
    backgroundColor: '#FFEFD5',
    borderRadius: 20,
    marginRight: 8,
  },
  freqButtonActive: {
    backgroundColor: '#FF8C00',
  },
  freqText: {
    fontSize: 12,
    color: '#000',
  },
  freqTextActive: {
    color: '#fff',
  },
  amountBox: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  currency: {
    fontSize: 10,
    color: '#000',
  },
  amount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    width: '100%',
  },
  addFund: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  addFundText: {
    marginLeft: 6,
    color: '#FF8C00',
  },
  continueButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    marginVertical: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    color: '#000',
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
});
