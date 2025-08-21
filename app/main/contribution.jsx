import React, { useState } from 'react'; 
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';

export default function GiveScreen() {
  const navigation = useNavigation();

  const [offering, setOffering] = useState('');
  const [frequency, setFrequency] = useState('One time');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [funds, setFunds] = useState([{ id: 1, value: 'General Fund' }]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Mobile money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const frequencies = ['One time', 'Weekly', 'Monthly', 'Every two weeks'];

  const addFund = () => {
    const newId = funds.length + 1;
    setFunds([...funds, { id: newId, value: '' }]);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowDatePicker(false);
    setStartDate(currentDate);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={16} color="#FF8C00" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Give</Text>

          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('notification')}>
              <Ionicons name="notifications-outline" size={24} color="#FF8C00" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('history')}>
              <Ionicons
                name="receipt-outline"
                size={24}
                color="#FF8C00"
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Offering */}
        <Text style={styles.label}>What’s your offering?</Text>
        <View style={styles.dropdown}>
          <Picker
            selectedValue={offering}
            onValueChange={(value) => setOffering(value)}
            style={styles.picker}
            dropdownIconColor="#FF8C00"
            mode="dropdown"
          >
            <Picker.Item label="Select..." value="" />
            <Picker.Item label="General Fund" value="General Fund" />
            <Picker.Item label="Missions" value="Missions" />
            <Picker.Item label="Tithe" value="Tithe" />
          </Picker>
        </View>

        {/* Frequency */}
        <Text style={styles.label}>Frequency</Text>
        <FlatList
          data={frequencies}
          horizontal
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.frequencyContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={1}
              style={[
                styles.freqButton,
                frequency === item && styles.freqButtonActive,
              ]}
              onPress={() => setFrequency(item)}
            >
              <Text
                style={[
                  styles.freqText,
                  frequency === item && styles.freqTextActive,
                ]}
              >
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
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#999"
          />
        </View>

        {/* Date & Location */}
        {frequency === 'Weekly' ? (
          <View style={styles.row}>
            <View style={[styles.inputWrapper, { marginRight: 8 }]}>
              <Text style={styles.label}>Start date</Text>
              <TouchableOpacity
                style={styles.textInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={{ color: '#000', fontSize: 12 }}>
                  {startDate.toLocaleDateString()}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Give to</Text>
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={location}
                  onValueChange={(value) => setLocation(value)}
                  style={styles.picker}
                  dropdownIconColor="#FF8C00"
                  mode="dropdown"
                >
                  <Picker.Item label="Select..." value="" />
                  <Picker.Item label="VCC - Goba Dar" value="VCC - Goba Dar" />
                  <Picker.Item label="VCC - Arusha" value="VCC - Arusha" />
                </Picker>
              </View>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.label}>Give to</Text>
            <View style={styles.dropdown}>
              <Picker
                selectedValue={location}
                onValueChange={(value) => setLocation(value)}
                style={styles.picker}
                dropdownIconColor="#FF8C00"
                mode="dropdown"
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="VCC Dar es salaam" value="VCC Dar es salaam" />
                <Picker.Item label="VCC Arusha" value="VCC Arusha" />
              </Picker>
            </View>
          </>
        )}

        {/* Add Fund */}
        <TouchableOpacity style={styles.addFund} onPress={addFund}>
          <Ionicons name="add" size={12} color="#FF8C00" />
          <Text style={styles.addFundText}>Add fund</Text>
        </TouchableOpacity>

        {/* Extra Funds */}
        {funds.length > 1 &&
          funds.slice(1).map((fund, index) => (
            <View key={fund.id} style={styles.extraFund}>
              <Text style={styles.label}>Additional Fund {index + 1}</Text>
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={fund.value}
                  onValueChange={(val) => {
                    const updatedFunds = [...funds];
                    updatedFunds[index + 1].value = val;
                    setFunds(updatedFunds);
                  }}
                  style={styles.picker}
                  dropdownIconColor="#FF8C00"
                  mode="dropdown"
                >
                  <Picker.Item label="Select..." value="" />
                  <Picker.Item label="General Fund" value="General Fund" />
                  <Picker.Item label="Missions" value="Missions" />
                  <Picker.Item label="Tithe" value="Tithe" />
                </Picker>
              </View>
            </View>
          ))}

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.continueButton}
          onPress={() => {
            if (!amount || isNaN(amount) || Number(amount) <= 0) {
              alert('Please enter an amount 😊');
            } else {
              setShowPaymentModal(true);
            }
          }}
        >
          <Text style={styles.continueButtonText}>
            {amount ? `Give TZS ${amount}` : 'Enter amount to continue'}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPaymentModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.modalBackButton}
                  onPress={() => setShowPaymentModal(false)}
                >
                  <Ionicons name="arrow-back" size={16} color="#FF8C00" />
                  <Text style={styles.modalBackText}>Back</Text>
                </TouchableOpacity>

                <Text style={styles.label}>Payment method</Text>
                <View style={styles.dropdown}>
                  <Picker
                    selectedValue={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value)}
                    style={styles.picker}
                    dropdownIconColor="#FF8C00"
                    mode="dropdown"
                  >
                    <Picker.Item label="Mobile money" value="Mobile money" />
                    <Picker.Item label="Card payment" value="Card payment" />
                  </Picker>
                </View>

                <Text style={styles.label}>
                  {paymentMethod === 'Card payment'
                    ? 'Card number'
                    : 'Mobile number'}
                </Text>
                <TextInput
                  style={styles.input}
                  value={paymentMethod === 'Card payment' ? cardNumber : mobileNumber}
                  onChangeText={
                    paymentMethod === 'Card payment' ? setCardNumber : setMobileNumber
                  }
                  keyboardType="numeric"
                  placeholder={
                    paymentMethod === 'Card payment'
                      ? '1234 5678 9012 3456'
                      : '+255 718 XXX XXX'
                  }
                  placeholderTextColor="#999"
                />

                {paymentMethod === 'Card payment' && (
                  <View style={styles.row}>
                    <View style={[styles.inputWrapper, { marginRight: 8 }]}>
                      <Text style={styles.label}>Expiry</Text>
                      <TextInput
                        style={styles.input}
                        value={expiryDate}
                        onChangeText={setExpiryDate}
                        keyboardType="numeric"
                        placeholder="MM/YY"
                        placeholderTextColor="#999"
                      />
                    </View>
                    <View style={styles.inputWrapper}>
                      <Text style={styles.label}>CVV</Text>
                      <TextInput
                        style={styles.input}
                        value={cvv}
                        onChangeText={setCvv}
                        keyboardType="numeric"
                        placeholder="123"
                        secureTextEntry
                        placeholderTextColor="#999"
                      />
                    </View>
                  </View>
                )}

                <TouchableOpacity
                  activeOpacity={1}
                  style={[styles.continueButton, { marginTop: 16 }]}
                  onPress={() => {
                    alert('Thank you! 🙏');
                    setShowPaymentModal(false);
                  }}
                >
                  <Text style={styles.continueButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    alignItems: 'center',
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
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
    color: '#000',
    backgroundColor: 'transparent',
  },
  frequencyContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  freqButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#FFEFD5',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 10, // reduced padding from 16 to 10
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FF8C00',
  },
  currency: {
    fontSize: 10, // reduced from 12
    color: '#000',
    marginBottom: 2, // reduced from 4
  },
  amount: {
    fontSize: 20, // reduced from 24
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputWrapper: {
    flex: 1,
  },
  textInput: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 8,
    marginBottom: 16,
  },
  addFund: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  addFundText: {
    marginLeft: 6,
    color: '#FF8C00',
    fontSize: 12,
  },
  extraFund: {
    marginBottom: 16,
  },
  continueButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 20, // oval shape
    paddingVertical: 10, // smaller height
    paddingHorizontal: 24, // horizontal padding for width
    alignItems: 'center',
    alignSelf: 'center', // center horizontally
    minWidth: 180,
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14, // smaller font size
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 16,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalBackText: {
    fontSize: 14,
    color: '#FF8C00',
    marginLeft: 4,
  },
});
