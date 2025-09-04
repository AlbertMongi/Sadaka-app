// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
//   TouchableWithoutFeedback,
//   Keyboard,
//   SafeAreaView,
//   Image,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { useRouter } from 'expo-router';

// const mobileNetworks = [
//   {
//     name: 'HaloPesa',
//     logo: 'https://portal.powertec.com.au/sites/default/files/styles/scale_square/public/2024-01/Viettel_Tanzania_Halotel_logo.png.webp?itok=1EgsL4zb',
//   },
//   {
//     name: 'TigoPesa',
//     logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbiP_Qnuwr0BRypVtoHN3fFKwwxdd89_sqQw&s',
//   },
//   {
//     name: 'Mpesa',
//     logo: 'https://images.seeklogo.com/logo-png/62/2/m-pesa-logo-png_seeklogo-622552.png',
//   },
//   {
//     name: 'AirtelMoney',
//     logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdtdumPWtXlSSZ_nEnxNzl2JLce4N7aPh-Jg&s',
//   },
// ];

// export default function GiveScreen() {
//   const navigation = useNavigation();
//   const router = useRouter();
//   const scrollRef = useRef(null);

//   const [offering, setOffering] = useState('');
//   const [frequency, setFrequency] = useState('One time');
//   const [amount, setAmount] = useState('');
//   const [location, setLocation] = useState('');
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState('Mobile money');
//   const [mobileNumber, setMobileNumber] = useState('');
//   const [selectedNetwork, setSelectedNetwork] = useState(mobileNetworks[0].name);
//   const [cardNumber, setCardNumber] = useState('');
//   const [expiryDate, setExpiryDate] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [token, setToken] = useState(null);
//   const [joinedCommunities, setJoinedCommunities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [communitiesLoading, setCommunitiesLoading] = useState(true);
//   const [notification, setNotification] = useState({ visible: false, type: '', message: '' });

//   const [showOfferingDropdown, setShowOfferingDropdown] = useState(false);
//   const [showLocationDropdown, setShowLocationDropdown] = useState(false);
//   const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

//   const frequencies = ['One time', 'Weekly', 'Monthly', 'Every two weeks'];
//   const offeringOptions = [
//     { label: 'Tithe', value: 'Tithe' },
//     { label: 'Missions', value: 'Missions' },
//     { label: 'General Fund', value: 'General Fund' },
//   ];
//   const paymentOptions = [
//     { label: 'Mobile money', value: 'Mobile money' },
//     { label: 'Card payment', value: 'Card payment' },
//   ];

//   const getHost = () => 'http://192.168.100.24:8000';

//   useEffect(() => {
//     const loadToken = async () => {
//       const savedToken = await AsyncStorage.getItem('userToken');
//       if (savedToken) setToken(savedToken);
//       else router.replace('/login');
//     };
//     loadToken();
//   }, []);

//   useEffect(() => {
//     if (!token) return;
//     const fetchCommunities = async () => {
//       try {
//         setCommunitiesLoading(true);
//         const res = await fetch(`${getHost()}/api/communities/joined`, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const json = await res.json();
//         if (res.ok && Array.isArray(json.data)) {
//           setJoinedCommunities(json.data);
//         } else {
//           setJoinedCommunities([]);
//         }
//       } catch (e) {
//         console.error('Error loading communities', e);
//         setJoinedCommunities([]);
//       } finally {
//         setCommunitiesLoading(false);
//       }
//     };
//     fetchCommunities();
//   }, [token]);

//   const formatAmountWithCommas = (value) => {
//     const numericValue = value.replace(/,/g, '').replace(/[^0-9]/g, '');
//     if (!numericValue) return '';
//     return parseInt(numericValue, 10).toLocaleString('en-US');
//   };

//   const handleAmountChange = (value) => {
//     const formatted = formatAmountWithCommas(value);
//     setAmount(formatted);
//   };

//   const sendContribution = async () => {
//     if (!offering || !amount || !location) {
//       setNotification({
//         visible: true,
//         type: 'error',
//         message: 'Please fill all required fields.',
//       });
//       setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
//       return;
//     }

//     const rawAmount = Number(amount.replace(/,/g, ''));
//     if (isNaN(rawAmount) || rawAmount <= 0) {
//       setNotification({
//         visible: true,
//         type: 'error',
//         message: 'Enter a valid amount.',
//       });
//       setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await fetch(`${getHost()}/api/contributions`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           offerType: offering,
//           amount: rawAmount,
//           purpose: frequency,
//           phoneNo: paymentMethod === 'Mobile money' ? mobileNumber : cardNumber,
//           communityId: location,
//           paymentMethod: paymentMethod === 'Mobile money' ? selectedNetwork : 'Card payment',
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || 'Failed to send contribution');
//       }
//       setNotification({
//         visible: true,
//         type: 'success',
//         message: 'Thank you! Your contribution has been sent.',
//       });
//       setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
//       setShowPaymentModal(false);
//       setAmount('');
//       setOffering('');
//       setLocation('');
//       setMobileNumber('');
//       setSelectedNetwork(mobileNetworks[0].name);
//       setCardNumber('');
//       setExpiryDate('');
//       setCvv('');
//     } catch (err) {
//       console.error(err);
//       setNotification({
//         visible: true,
//         type: 'error',
//         message: err.message,
//       });
//       setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getSelectedOfferingLabel = () => {
//     const selected = offeringOptions.find(opt => opt.value === offering);
//     return selected ? selected.label : 'Select offering';
//   };

//   const getSelectedLocationLabel = () => {
//     const selected = joinedCommunities.find(c => c.id === location);
//     return selected ? selected.name : 'Select community';
//   };

//   const getSelectedPaymentLabel = () => {
//     const selected = paymentOptions.find(opt => opt.value === paymentMethod);
//     return selected ? selected.label : 'Select payment method';
//   };

//   const CustomDropdown = ({ options, selectedValue, onSelect, placeholder, disabled }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//       <View style={styles.dropdownContainer}>
//         <TouchableOpacity
//           style={[styles.customDropdown, disabled && styles.disabledDropdown]}
//           onPress={() => !disabled && setIsOpen(!isOpen)}
//           disabled={disabled}
//         >
//           <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
//             {disabled ? 'Loading...' : selectedValue || placeholder}
//           </Text>
//           <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#FF8C00" />
//         </TouchableOpacity>
//         {isOpen && (
//           <View style={styles.dropdownMenu}>
//             <ScrollView nestedScrollEnabled>
//               {options.map((option) => (
//                 <TouchableOpacity
//                   key={option.value}
//                   style={styles.dropdownItem}
//                   onPress={() => {
//                     onSelect(option.value);
//                     setIsOpen(false);
//                   }}
//                 >
//                   <Text style={styles.dropdownItemText}>{option.label}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         )}
//       </View>
//     );
//   };

//   const Notification = ({ visible, type, message }) => {
//     if (!visible) return null;
//     return (
//       <View style={[styles.notificationContainer, type === 'success' ? styles.notificationSuccess : styles.notificationError]}>
//         <Text style={styles.notificationText}>{message}</Text>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
//         style={styles.keyboardView}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <ScrollView
//             contentContainerStyle={styles.container}
//             keyboardShouldPersistTaps="handled"
//             ref={scrollRef}
//             showsVerticalScrollIndicator={false}
//           >
//             <View style={styles.header}>
//               <TouchableOpacity onPress={() => navigation.goBack()}>
//                 <Ionicons name="arrow-back" size={20} color="#FF8C00" />
//               </TouchableOpacity>
//               <Text style={styles.headerTitle}>Give</Text>
//               <View style={styles.headerIcons}>
//           <TouchableOpacity onPress={() => navigation.navigate('history')}>
//     <Ionicons name="receipt-outline"  size={20} color="#FF8C00" />
//   </TouchableOpacity>
//               </View>
//             </View>

//             <Notification
//               visible={notification.visible}
//               type={notification.type}
//               message={notification.message}
//             />

//             <Text style={styles.label}>What's your offering?</Text>
//             <CustomDropdown
//               options={offeringOptions}
//               selectedValue={getSelectedOfferingLabel()}
//               onSelect={(value) => setOffering(value)}
//               placeholder="Select offering"
//             />

//             <Text style={styles.label}>Frequency</Text>
//             <View style={styles.frequencyContainer}>
//               {frequencies.map((item) => (
//                 <TouchableOpacity
//                   key={item}
//                   style={[styles.freqButton, frequency === item && styles.freqButtonActive]}
//                   onPress={() => setFrequency(item)}
//                 >
//                   <Text style={[styles.freqText, frequency === item && styles.freqTextActive]}>
//                     {item}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>

//             <View style={styles.amountBox}>
//               <Text style={styles.currency}>TZS</Text>
//               <TextInput
//                 style={styles.amount}
//                 value={amount}
//                 onChangeText={handleAmountChange}
//                 keyboardType="numeric"
//                 placeholder="Enter amount"
//                 placeholderTextColor="#999"
//               />
//             </View>

//             <Text style={styles.label}>Give to</Text>
//             <CustomDropdown
//               options={joinedCommunities.map(c => ({ label: c.name, value: c.id }))}
//               selectedValue={getSelectedLocationLabel()}
//               onSelect={(value) => setLocation(value)}
//               placeholder="Select community"
//               disabled={communitiesLoading}
//             />

//             <TouchableOpacity
//               style={styles.continueButton}
//               onPress={() => setShowPaymentModal(true)}
//             >
//               <Text style={styles.continueText}>Continue</Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </TouchableWithoutFeedback>
//       </KeyboardAvoidingView>

//       <Modal
//         visible={showPaymentModal}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowPaymentModal(false)}
//       >
//         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//           <View style={styles.modalWrapper}>
//             <KeyboardAvoidingView
//               behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//               keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
//               style={styles.modalKeyboardView}
//             >
//               <View style={styles.modalContainer}>
//                 <View style={styles.modalContent}>
//                   <View style={styles.modalHeader}>
//                     <Text style={styles.modalTitle}>Choose Payment Method</Text>
//                     <TouchableOpacity 
//                       onPress={() => setShowPaymentModal(false)}
//                       style={styles.closeButton}
//                     >
//                       <Ionicons name="close" size={20} color="#666" />
//                     </TouchableOpacity>
//                   </View>

//                   <CustomDropdown
//                     options={paymentOptions}
//                     selectedValue={getSelectedPaymentLabel()}
//                     onSelect={(value) => setPaymentMethod(value)}
//                     placeholder="Select payment method"
//                   />

//                   {paymentMethod === 'Mobile money' ? (
//                     <>
//                       <Text style={styles.label}>Mobile Network</Text>
//                       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.networkContainer}>
//                         {mobileNetworks.map((network) => (
//                           <TouchableOpacity
//                             key={network.name}
//                             style={[
//                               styles.networkButton,
//                               selectedNetwork === network.name && styles.networkButtonActive,
//                             ]}
//                             onPress={() => setSelectedNetwork(network.name)}
//                           >
//                             <Image source={{ uri: network.logo }} style={styles.networkLogo} />
//                           </TouchableOpacity>
//                         ))}
//                       </ScrollView>
//                       <Text style={styles.label}>Mobile Number</Text>
//                       <TextInput
//                         style={styles.textInput}
//                         value={mobileNumber}
//                         onChangeText={setMobileNumber}
//                         placeholder="Phone number"
//                         placeholderTextColor="#999"
//                         keyboardType="phone-pad"
//                       />
//                     </>
//                   ) : (
//                     <>
//                       {/* <Text style={styles.label}>Card Number</Text>
//                       <TextInput
//                         style={styles.textInput}
//                         value={cardNumber}
//                         onChangeText={setCardNumber}
//                         placeholder="1234 5678 9012 3456"
//                         placeholderTextColor="#999"
//                         keyboardType="numeric"
//                       />
//                       <View style={styles.cardDetailsContainer}>
//                         <View style={styles.cardDetail}>
//                           <Text style={styles.label}>Expiry Date</Text>
//                           <TextInput
//                             style={[styles.textInput, styles.cardInput]}
//                             value={expiryDate}
//                             onChangeText={setExpiryDate}
//                             placeholder="MM/YY"
//                             placeholderTextColor="#999"
//                             keyboardType="numeric"
//                           />
//                         </View>
//                         <View style={styles.cardDetail}>
//                           <Text style={styles.label}>CVV</Text>
//                           <TextInput
//                             style={[styles.textInput, styles.cardInput]}
//                             value={cvv}
//                             onChangeText={setCvv}
//                             placeholder="123"
//                             placeholderTextColor="#999"
//                             keyboardType="numeric"
//                             secureTextEntry
//                           />
//                         </View>
//                       </View> */}
//                     </>
//                   )}

//                   <TouchableOpacity
//                     style={styles.submitButton}
//                     onPress={sendContribution}
//                     disabled={loading}
//                   >
//                     <Text style={styles.submitText}>
//                       {loading ? 'Sending...' : 'Submit'}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </KeyboardAvoidingView>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 12,
//     paddingVertical: Platform.OS === 'ios' ? -40 : 2,
//     backgroundColor: '#fff',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 8,
//     marginBottom: 12,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333',
//   },
//   headerIcons: {
//     flexDirection: 'row',
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     marginBottom: 6,
//     color: '#333',
//     marginTop: 8,
//   },
//   dropdownContainer: {
//     position: 'relative',
//     marginBottom: 12,
//   },
//   customDropdown: {
//     borderWidth: 1,
//     borderColor: '#FF8C00',
//     borderRadius: 6,
//     backgroundColor: '#fff',
//     height: 40,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 8,
//   },
//   disabledDropdown: {
//     opacity: 0.5,
//   },
//   dropdownText: {
//     fontSize: 14,
//     color: '#333',
//     flex: 1,
//   },
//   placeholderText: {
//     color: '#999',
//   },
//   dropdownMenu: {
//     borderWidth: 1,
//     borderColor: '#FF8C00',
//     borderRadius: 6,
//     backgroundColor: '#fff',
//     position: 'absolute',
//     top: 42,
//     left: 0,
//     right: 0,
//     zIndex: 1000,
//     maxHeight: 180,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   dropdownItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//   },
//   dropdownItemText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   frequencyContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 12,
//     paddingVertical: 6,
//     gap: 6,
//   },
//   freqButton: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     backgroundColor: '#FFEFD5',
//     borderRadius: 16,
//     minWidth: 50,
//     alignItems: 'center',
//   },
//   freqButtonActive: {
//     backgroundColor: '#FF8C00',
//   },
//   freqText: {
//     fontSize: 12,
//     color: '#333',
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   freqTextActive: {
//     color: '#fff',
//   },
//   amountBox: {
//     borderWidth: 1,
//     borderColor: '#FF8C00',
//     borderRadius: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     marginBottom: 12,
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     minHeight: 70,
//     justifyContent: 'center',
//   },
//   currency: {
//     fontSize: 12,
//     color: '#666',
//     marginBottom: 6,
//     fontWeight: '500',
//   },
//   amount: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#333',
//     textAlign: 'center',
//     width: '100%',
//     minHeight: 28,
//   },
//   continueButton: {
//     backgroundColor: '#FF8C00',
//     borderRadius: 6,
//     paddingVertical: 10,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     marginTop: 12,
//     marginBottom: 16,
//   },
//   continueText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   submitButton: {
//     backgroundColor: '#FF8C00',
//     borderWidth: 1,
//     borderColor: '#FF8C00',
//     borderRadius: 6,
//     paddingVertical: 10,
//     paddingHorizontal: 24,
//     alignItems: 'center',
//     marginTop: 12,
//     width: '100%',
//   },
//   submitText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   textInput: {
//     borderWidth: 1,
//     borderColor: '#FF8C00',
//     borderRadius: 6,
//     paddingVertical: 8,
//     paddingHorizontal: 8,
//     marginBottom: 8,
//     color: '#333',
//     backgroundColor: '#fff',
//     fontSize: 14,
//     minHeight: 40,
//   },
//   modalWrapper: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   modalKeyboardView: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     padding: 12,
//     borderTopLeftRadius: 12,
//     borderTopRightRadius: 12,
//     minHeight: 280,
//     maxHeight: '80%',
//   },
//   modalContent: {
//     backgroundColor: '#fff',
//     flexGrow: 1,
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 6,
//     borderRadius: 12,
//     backgroundColor: '#f5f5f5',
//   },
//   networkContainer: {
//     flexDirection: 'row',
//     marginBottom: 8,
//     paddingHorizontal: 2,
//   },
//   networkButton: {
//     padding: 6,
//     borderWidth: 1,
//     borderColor: '#fff',
//     borderRadius: 6,
//     marginRight: 8,
//   },
//   networkButtonActive: {
//     borderColor: '#FF8C00',
//   },
//   networkLogo: {
//     width: 40,
//     height: 40,
//   },
//   cardDetailsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     gap: 8,
//     marginBottom: 8,
//   },
//   cardDetail: {
//     flex: 1,
//   },
//   cardInput: {
//     paddingVertical: 8,
//   },
//   notificationContainer: {
//     padding: 8,
//     borderRadius: 6,
//     marginBottom: 12,
//     alignItems: 'center',
//   },
//   notificationSuccess: {
//     backgroundColor: '#E6FFE6',
//     borderColor: '#00CC00',
//     borderWidth: 1,
//   },
//   notificationError: {
//     backgroundColor: '#FFE6E6',
//     borderColor: '#CC0000',
//     borderWidth: 1,
//   },
//   notificationText: {
//     fontSize: 14,
//     color: '#333',
//     fontWeight: '500',
//   },
// });



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

  const [offering, setOffering] = useState('');
  const [frequency, setFrequency] = useState('One time');
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('Mobile money');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState(mobileNetworks[0].name);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [token, setToken] = useState(null);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [communitiesLoading, setCommunitiesLoading] = useState(true);
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });

  const [showOfferingDropdown, setShowOfferingDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const frequencies = ['One time', 'Weekly', 'Monthly', 'Every two weeks'];
  const offeringOptions = [
    { label: 'Tithe', value: 'Tithe' },
    { label: 'Missions', value: 'Missions' },
    { label: 'General Fund', value: 'General Fund' },
  ];
  const paymentOptions = [
    { label: 'Mobile money', value: 'Mobile money' },
    { label: 'Card payment', value: 'Card payment' },
  ];

  const getHost = () => 'http://192.168.100.24:8000';

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
        setCommunitiesLoading(true);
        const res = await fetch(`${getHost()}/api/communities/joined`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (res.ok && Array.isArray(json.data)) {
          setJoinedCommunities(json.data);
        } else {
          setJoinedCommunities([]);
        }
      } catch (e) {
        console.error('Error loading communities', e);
        setJoinedCommunities([]);
      } finally {
        setCommunitiesLoading(false);
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

  const sendContribution = async () => {
    if (!offering || !amount || !location) {
      setNotification({
        visible: true,
        type: 'error',
        message: 'Please fill all required fields.',
      });
      setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
      return;
    }

    const rawAmount = Number(amount.replace(/,/g, ''));
    if (isNaN(rawAmount) || rawAmount <= 0) {
      setNotification({
        visible: true,
        type: 'error',
        message: 'Enter a valid amount.',
      });
      setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
      return;
    }

    try {
      setLoading(true);
      if (paymentMethod === 'Card payment') {
        // Validate card details
        if (!cardNumber || !expiryDate || !cvv) {
          throw new Error('Please fill all card details.');
        }
        // Open WebBrowser for card payment
        // const paymentUrl = `${getHost()}/api/contributions/user?amount=${rawAmount}&offerType=${encodeURIComponent(offering)}&purpose=${encodeURIComponent(frequency)}&communityId=${location}&cardNumber=${encodeURIComponent(cardNumber)}&expiryDate=${encodeURIComponent(expiryDate)}&cvv=${encodeURIComponent(cvv)}`;
         const paymentUrl = `www.facebook.com`;
        await WebBrowser.openBrowserAsync(paymentUrl);
        setNotification({
          visible: true,
          type: 'success',
          message: 'Redirecting to payment page...',
        });
        setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
      } else {
        // Existing mobile money payment logic
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
            phoneNo: mobileNumber,
            communityId: location,
            paymentMethod: selectedNetwork,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to send contribution');
        }
        setNotification({
          visible: true,
          type: 'success',
          message: 'Thank you! Your contribution has been sent.',
        });
        setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
      }
      setShowPaymentModal(false);
      setAmount('');
      setOffering('');
      setLocation('');
      setMobileNumber('');
      setSelectedNetwork(mobileNetworks[0].name);
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
    } catch (err) {
      console.error(err);
      setNotification({
        visible: true,
        type: 'error',
        message: err.message,
      });
      setTimeout(() => setNotification({ visible: false, type: '', message: '' }), 3000);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedOfferingLabel = () => {
    const selected = offeringOptions.find(opt => opt.value === offering);
    return selected ? selected.label : 'Select offering';
  };

  const getSelectedLocationLabel = () => {
    const selected = joinedCommunities.find(c => c.id === location);
    return selected ? selected.name : 'Select community';
  };

  const getSelectedPaymentLabel = () => {
    const selected = paymentOptions.find(opt => opt.value === paymentMethod);
    return selected ? selected.label : 'Select payment method';
  };

  const CustomDropdown = ({ options, selectedValue, onSelect, placeholder, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={[styles.customDropdown, disabled && styles.disabledDropdown]}
          onPress={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
            {disabled ? 'Loading...' : selectedValue || placeholder}
          </Text>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={18} color="#FF8C00" />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.dropdownMenu}>
            <ScrollView nestedScrollEnabled>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#FF8C00" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Give</Text>
              <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('history')}>
                  <Ionicons name="receipt-outline" size={20} color="#FF8C00" />
                </TouchableOpacity>
              </View>
            </View>

            <Notification
              visible={notification.visible}
              type={notification.type}
              message={notification.message}
            />

            <Text style={styles.label}>What's your offering?</Text>
            <CustomDropdown
              options={offeringOptions}
              selectedValue={getSelectedOfferingLabel()}
              onSelect={(value) => setOffering(value)}
              placeholder="Select offering"
            />

            <Text style={styles.label}>Frequency</Text>
            <View style={styles.frequencyContainer}>
              {frequencies.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[styles.freqButton, frequency === item && styles.freqButtonActive]}
                  onPress={() => setFrequency(item)}
                >
                  <Text style={[styles.freqText, frequency === item && styles.freqTextActive]}>
                    {item}
                  </Text>
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

            <Text style={styles.label}>Give to</Text>
            <CustomDropdown
              options={joinedCommunities.map(c => ({ label: c.name, value: c.id }))}
              selectedValue={getSelectedLocationLabel()}
              onSelect={(value) => setLocation(value)}
              placeholder="Select community"
              disabled={communitiesLoading}
            />

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowPaymentModal(true)}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalWrapper}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
              style={styles.modalKeyboardView}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Choose Payment Method</Text>
                    <TouchableOpacity 
                      onPress={() => setShowPaymentModal(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={20} color="#666" />
                    </TouchableOpacity>
                  </View>

                  <CustomDropdown
                    options={paymentOptions}
                    selectedValue={getSelectedPaymentLabel()}
                    onSelect={(value) => setPaymentMethod(value)}
                    placeholder="Select payment method"
                  />

                  {paymentMethod === 'Mobile money' ? (
                    <>
                      <Text style={styles.label}>Choose Mobile Network</Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.networkContainer}>
                        {mobileNetworks.map((network) => (
                          <TouchableOpacity
                            key={network.name}
                            style={[
                              styles.networkButton,
                              selectedNetwork === network.name && styles.networkButtonActive,
                            ]}
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
                  ) : (
                    <>
                      {/* <Text style={styles.label}>Card Number</Text>
                      <TextInput
                        style={styles.textInput}
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        placeholder="1234 5678 9012 3456"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                      />
                      <View style={styles.cardDetailsContainer}>
                        <View style={styles.cardDetail}>
                          <Text style={styles.label}>Expiry Date</Text>
                          <TextInput
                            style={[styles.textInput, styles.cardInput]}
                            value={expiryDate}
                            onChangeText={setExpiryDate}
                            placeholder="MM/YY"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={styles.cardDetail}>
                          <Text style={styles.label}>CVV</Text>
                          <TextInput
                            style={[styles.textInput, styles.cardInput]}
                            value={cvv}
                            onChangeText={setCvv}
                            placeholder="123"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            secureTextEntry
                          />
                        </View>
                      </View> */}
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={sendContribution}
                    disabled={loading}
                  >
                    <Text style={styles.submitText}>
                      {loading ? 'Sending...' : 'Submit'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? -40 : 2,
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
    fontWeight: '700',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
    marginTop: 8,
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: 12,
  },
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
  disabledDropdown: {
    opacity: 0.5,
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
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
    fontWeight: '500',
    textAlign: 'center',
  },
  freqTextActive: {
    color: '#fff',
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
    fontWeight: '500',
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    width: '100%',
    minHeight: 28,
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
    fontWeight: '600',
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
    fontWeight: '600',
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
  modalContent: {
    backgroundColor: '#fff',
    flexGrow: 1,
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
    fontWeight: '700',
    color: '#333',
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
  cardDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  cardDetail: {
    flex: 1,
  },
  cardInput: {
    paddingVertical: 8,
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
    fontWeight: '500',
  },
});