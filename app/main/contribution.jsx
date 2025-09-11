
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
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { BASE_URL } from '../apiConfig';

const mobileNetworks = [
  {
    name: 'HaloPesa',
    logo: 'https://portal.powertec.com.au/sites/default/files/styles/scale_square/public/2024-01/Viettel_Tanzania_Halotel_logo.png.webp?itok=1EgsL4zb',
  },
  {
    name: 'TigoPesa',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbiP_Qnuwr0BRypVtoHN3fFKwwxdd89_sqQw&s',
  },
  {
    name: 'Mpesa',
    logo: 'https://images.seeklogo.com/logo-png/62/2/m-pesa-logo-png_seeklogo-622552.png',
  },
  {
    name: 'AirtelMoney',
    logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdtdumPWtXlSSZ_nEnxNzl2JLce4N7aPh-Jg&s',
  },
];

export default function GiveScreen() {
  const navigation = useNavigation();
  const router = useRouter();
  const scrollRef = useRef(null);

  // State hooks
  const [offering, setOffering] = useState('');
  const [frequency, setFrequency] = useState('One time');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Mobile money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(mobileNetworks[0].name);
  const [token, setToken] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });

  // Dropdown options
  const offeringOptions = [
    { label: 'Tithe', value: 'Tithe' },
    { label: 'Missions', value: 'Missions' },
    { label: 'General Fund', value: 'General Fund' },
  ];
  const frequencies = ['One time', 'Weekly', 'Monthly', 'Every two weeks'];
  const paymentOptions = [
    { label: 'Mobile money', value: 'Mobile money' },
    { label: 'Card payment', value: 'Card payment' },
  ];

  // API host
  const getHost = () => BASE_URL;

  // Token loading & authentication
  useEffect(() => {
    (async () => {
      const savedToken = await AsyncStorage.getItem('userToken');
      if (savedToken) setToken(savedToken);
      else router.replace('/login');
    })();
  }, []);

  // Load joined communities
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setCommunitiesLoading(true);
        const res = await fetch(`${getHost()}/communities/joined`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        setJoinedCommunities(res.ok && Array.isArray(json.data) ? json.data : []);
      } catch (e) {
        console.error('Error loading communities', e);
        setJoinedCommunities([]);
      } finally {
        setCommunitiesLoading(false);
      }
    })();
  }, [token]);

  // Formatting amount input
  const formatAmountWithCommas = (val) => {
    const numeric = val.replace(/,/g, '').replace(/\D/g, '');
    return numeric ? parseInt(numeric, 10).toLocaleString('en-US') : '';
  };

  const handleAmountChange = (val) => setAmount(formatAmountWithCommas(val));

  // Notification helpers
  const showNotification = (type, msg) => {
    setNotification({ visible: true, type, message: msg });
    setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
  };

  // Contribution submission logic
  const sendContribution = async () => {
    if (!offering || !amount || !location) {
      return showNotification('error', 'Please fill all required fields.');
    }

    const rawAmount = Number(amount.replace(/,/g, ''));
    if (!rawAmount || isNaN(rawAmount)) {
      return showNotification('error', 'Enter a valid amount.');
    }

    try {
      setLoading(true);
      if (paymentMethod === 'Card payment') {
        // Simple redirect, no data sent
        const paymentUrl = `${getHost()}/payments/card`;
        await WebBrowser.openBrowserAsync(paymentUrl);
        showNotification('success', 'Redirecting to payment page...');
      } else {
        // Mobile money flow
        const res = await fetch(`${getHost()}/contributions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            offerType: offering,
            amount: rawAmount,
            purpose: frequency,
            phoneNo: mobileNumber,
            communityId: location,
            paymentMethod: selectedNetwork,
          }),
        });
        if (!res.ok) {
          const errJson = await res.json();
          throw new Error(errJson.message || 'Failed to send contribution');
        }
        showNotification('success', 'Thank you! Your contribution has been sent.');
      }

      // Reset form
      setShowPaymentModal(false);
      setOffering('');
      setFrequency('One time');
      setAmount('');
      setLocation('');
      setMobileNumber('');
      setSelectedNetwork(mobileNetworks[0].name);
      setPaymentMethod('Mobile money');
    } catch (error) {
      console.error(error);
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Dropdown labels
  const getSelectedOfferingLabel = () => (offeringOptions.find(o => o.value === offering)?.label || 'Select offering');
  const getSelectedLocationLabel = () => (joinedCommunities.find(c => c.id === location)?.name || 'Select community');
  const getSelectedPaymentLabel = () => (paymentOptions.find(o => o.value === paymentMethod)?.label || 'Select payment method');

  // Custom dropdown component
  const CustomDropdown = ({ options, selectedValue, onSelect, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[styles.customDropdown, disabled && styles.disabledDropdown]}
          disabled={disabled}
          onPress={() => !disabled && setIsOpen(prev => !prev)}
        >
          <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
            {disabled ? 'Loading...' : selectedValue || placeholder}
          </Text>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#FF8C00" />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdownMenu}>
            <ScrollView nestedScrollEnabled>
              {options.map(opt => (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(opt.value);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  // Notification component
  const Notification = ({ visible, type, message }) => {
    if (!visible) return null;
    return (
      <View style={[styles.notificationContainer, type === 'success' ? styles.notificationSuccess : styles.notificationError]}>
        <Text style={styles.notificationText}>{message}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20} style={styles.keyboardView}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" ref={scrollRef} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons   color="#FF8C00" /></TouchableOpacity>
              <Text style={styles.headerTitle}>Give</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('history')}><Ionicons name="receipt-outline" size={20} color="#FF8C00" /></TouchableOpacity>
              </View>
            </View>

            <Notification visible={notification.visible} type={notification.type} message={notification.message} />

                  <Text style={styles.label}>Give to</Text>
            <CustomDropdown
              options={joinedCommunities.map(c => ({ label: c.name, value: c.id }))}
              selectedValue={getSelectedLocationLabel()}
              onSelect={setLocation}
              placeholder="Select community"
              disabled={communitiesLoading}
            />


            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {frequencies.map(f => (
                <TouchableOpacity key={f} style={[styles.freqButton, frequency === f && styles.freqButtonActive]} onPress={() => setFrequency(f)}>
                  <Text style={[styles.freqText, frequency === f && styles.freqTextActive]}>{f}</Text>
                </TouchableOpacity>
              ))}
            </View>

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
                  <Text style={styles.label}>What's your offering?</Text>
            <CustomDropdown options={offeringOptions} selectedValue={getSelectedOfferingLabel()} onSelect={setOffering} placeholder="Select offering" />


            <TouchableOpacity style={styles.continueButton} onPress={() => setShowPaymentModal(true)}>
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal visible={showPaymentModal} transparent animationType="slide" onRequestClose={() => setShowPaymentModal(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalWrapper}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} style={styles.modalKeyboardView}>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Choose Payment Method</Text>
                  <TouchableOpacity onPress={() => setShowPaymentModal(false)} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color="#666" />
                  </TouchableOpacity>
                </View>

                <CustomDropdown options={paymentOptions} selectedValue={getSelectedPaymentLabel()} onSelect={setPaymentMethod} placeholder="Select payment method" />

                {paymentMethod === 'Mobile money' && (
                  <>
                    <Text style={styles.label}>Choose Mobile Network</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.networkContainer}>
                      {mobileNetworks.map(network => (
                        <TouchableOpacity
                          key={network.name}
                          style={[styles.networkButton, selectedNetwork === network.name && styles.networkButtonActive]}
                          onPress={() => setSelectedNetwork(network.name)}
                        >
                          <Image source={{ uri: network.logo }} style={styles.networkLogo} />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <Text style={styles.label}>Mobile Number</Text>
                    <TextInput
                      style={styles.textInput}
                      value={mobileNumber}
                      onChangeText={setMobileNumber}
                      placeholder="Phone number"
                      placeholderTextColor="#999"
                      keyboardType="phone-pad"
                    />
                  </>
                )}

                <TouchableOpacity style={styles.submitButton} onPress={sendContribution} disabled={loading}>
                  <Text style={styles.submitText}>{loading ? 'Sending...' : 'Submit'}</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  keyboardView: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? -40 : 30,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'GothamBold',
    color: '#333',
  },
  headerIcons: { flexDirection: 'row' },
  label: {
    fontSize: 14,
    fontFamily: 'GothamMedium',
    marginBottom: 6,
    color: '#333',
    marginTop: 8,
  },
  dropdownContainer: { position: 'relative', marginBottom: 12 },
  customDropdown: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 6,
    backgroundColor: '#fff',
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  disabledDropdown: { opacity: 0.5 },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontFamily: 'GothamBold',
  },
  placeholderText: {
    color: '#999',
    fontFamily: 'GothamLight',
  },
  dropdownMenu: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 6,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    zIndex: 1000,
    maxHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'GothamRegular',
  },
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    paddingVertical: 6,
    gap: 6,
  },
  freqButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFEFD5',
    borderRadius: 16,
    minWidth: 50,
    alignItems: 'center',
  },
  freqButtonActive: {
    backgroundColor: '#FF8C00',
  },
  freqText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'GothamRegular',
  },
  freqTextActive: {
    color: '#fff',
    fontFamily: 'GothamBold',
  },
  amountBox: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    minHeight: 70,
    justifyContent: 'center',
  },
  currency: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontFamily: 'GothamRegular',
  },
  amount: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    width: '100%',
    minHeight: 28,
    fontFamily: 'GothamBold',
  },
  continueButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'GothamBold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 8,
    color: '#333',
    backgroundColor: '#fff',
    fontSize: 14,
    fontFamily: 'GothamRegular',
    minHeight: 40,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalKeyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    minHeight: 280,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    color: '#333',
    fontFamily: 'GothamBold',
  },
  closeButton: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  networkContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  networkButton: {
    padding: 6,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    marginRight: 8,
  },
  networkButtonActive: {
    borderColor: '#FF8C00',
  },
  networkLogo: {
    width: 40,
    height: 40,
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'GothamBold',
  },
  notificationContainer: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  notificationSuccess: {
    backgroundColor: '#E6FFE6',
    borderColor: '#00CC00',
    borderWidth: 1,
  },
  notificationError: {
    backgroundColor: '#FFE6E6',
    borderColor: '#CC0000',
    borderWidth: 1,
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'GothamRegular',
  },
});
