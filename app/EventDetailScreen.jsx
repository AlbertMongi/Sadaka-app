// // import React, { useEffect, useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Animated,
// //   ScrollView,
// //   Image,
// //   SafeAreaView,
// //   TouchableOpacity,
// //   Alert,
// //   Dimensions,
// //   Share,
// // } from 'react-native';
// // import { Ionicons } from '@expo/vector-icons';
// // import { useNavigation, useRoute } from '@react-navigation/native';
// // import { BASE_URL } from './apiConfig';

// // const GOLD = '#FF8C00';
// // const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// // export default function EventDetailScreen() {
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const [eventData, setEventData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const scrollY = React.useRef(new Animated.Value(0)).current;
// //   const dropUpAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

// //   const eventId = route?.params?.id;

// //   useEffect(() => {
// //     if (!eventId) {
// //       setError('No event ID provided.');
// //       setLoading(false);
// //       return;
// //     }

// //     const fetchEventDetails = async () => {
// //       try {
// //         const response = await fetch(`${BASE_URL}/events/${eventId}`);
// //         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

// //         const json = await response.json();

// //         if (json.success && json.data) {
// //           setEventData(json.data);
// //         } else {
// //           setError('Failed to load event details.');
// //         }
// //       } catch (err) {
// //         setError('Network error while fetching event.');
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchEventDetails();

// //     // Animate drop-up effect
// //     Animated.timing(dropUpAnim, {
// //       toValue: 0,
// //       duration: 800,
// //       useNativeDriver: true,
// //     }).start();
// //   }, [eventId]);

// //   const handleNotifyAttendance = async () => {
// //     try {
// //       const response = await fetch(`${BASE_URL}/events/notify/${eventId}`, {
// //         method: 'POST',
// //       });

// //       if (!response.ok) {
// //         throw new Error(`Failed to notify. Status: ${response.status}`);
// //       }

// //       Alert.alert('Success', 'You have successfully confirmed your attendance!');
// //     } catch (err) {
// //       Alert.alert('Error', 'Failed to notify attendance. Please try again.');
// //       console.error(err);
// //     }
// //   };

// //   const handleShare = async () => {
// //     try {
// //       const result = await Share.share({
// //         message: `Join me at ${eventData.name}! ${eventData.description} on ${new Date(eventData.eventDate).toLocaleDateString()}. Location: ${eventData.street}, ${eventData.district}, ${eventData.region}.`,
// //         url: eventData.imageUrl,
// //         title: eventData.name,
// //       });

// //       if (result.action === Share.sharedAction) {
// //         // Shared
// //       }
// //     } catch (error) {
// //       Alert.alert('Error', 'Failed to share the event.');
// //       console.error(error);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <View style={styles.centered}>
// //         <ActivityIndicator size="large" color={GOLD} />
// //       </View>
// //     );
// //   }

// //   if (error || !eventData) {
// //     return (
// //       <View style={styles.centered}>
// //         <Text style={styles.errorText}>{error || 'No event data found.'}</Text>
// //       </View>
// //     );
// //   }

// //   const imageScale = scrollY.interpolate({
// //     inputRange: [-100, 0],
// //     outputRange: [1.2, 1],
// //     extrapolate: 'clamp',
// //   });

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {/* Back Arrow at Top */}
// //       <View style={styles.headerContainer}>
// //         <TouchableOpacity onPress={() => navigation.navigate('main', { screen: 'bible' })}>
// //           <Ionicons name="arrow-back" size={24} color={GOLD} />
// //         </TouchableOpacity>
// //       </View>

// //       {/* Content */}
// //       <Animated.ScrollView
// //         style={styles.scroll}
// //         contentContainerStyle={styles.scrollContent}
// //         showsVerticalScrollIndicator={false}
// //         onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
// //         scrollEventThrottle={16}
// //       >
// //         {/* Full Screen Image */}
// //         <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
// //           <Image
// //             source={{
// //               uri: eventData.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s',
// //             }}
// //             style={styles.image}
// //             resizeMode="cover"
// //           />
// //         </Animated.View>

// //         {/* Drop-Up Info Section */}
// //         <Animated.View
// //           style={[
// //             styles.infoContainer,
// //             { transform: [{ translateY: dropUpAnim }] },
// //             // Apply shadow only after loading is complete
// //             !loading && {
// //               shadowColor: '#000',
// //               shadowOpacity: 0.1,
// //               shadowOffset: { width: 0, height: -2 },
// //               shadowRadius: 8,
// //               elevation: 5,
// //             },
// //           ]}
// //         >
// //           {/* Centered Event Name */}
// //           <View style={styles.titleWrapper}>
// //             <Text style={styles.headerTitle} numberOfLines={2}>
// //               {eventData.name}
// //             </Text>
// //           </View>

// //           <Text style={styles.infoText}>
// //             {`${eventData.description || 'No description provided.'}`}
// //           </Text>
// //           <View style={styles.detailRow}>
// //             <Ionicons name="location-outline" size={16} color={GOLD} />
// //             <Text style={styles.detailText}>
// //               {`${eventData.street}, ${eventData.district}, ${eventData.region}`}
// //             </Text>
// //           </View>
// //           <View style={styles.detailRow}>
// //             <Ionicons name="calendar-outline" size={16} color={GOLD} />
// //             <Text style={styles.detailText}>
// //               {new Date(eventData.eventDate).toLocaleDateString(undefined, {
// //                 weekday: 'long',
// //                 year: 'numeric',
// //                 month: 'long',
// //                 day: 'numeric',
// //               })}
// //             </Text>
// //           </View>
// //           <View style={styles.iconRow}>
// //             <TouchableOpacity style={styles.smallIconButton} onPress={handleShare}>
// //               <Ionicons name="share-social-outline" size={16} color={GOLD} />
// //             </TouchableOpacity>
// //             <TouchableOpacity style={styles.smallIconButton} onPress={handleNotifyAttendance}>
// //               <Ionicons name="checkmark-circle-outline" size={16} color={GOLD} />
// //             </TouchableOpacity>
// //           </View>
// //         </Animated.View>
// //       </Animated.ScrollView>

// //       {/* Floating Attend Button */}
// //       <TouchableOpacity
// //         style={[
// //           styles.attendButton,
// //           // Apply shadow only after loading is complete
// //           !loading && {
// //             shadowColor: '#000',
// //             shadowOpacity: 0.15,
// //             shadowOffset: { width: 0, height: 4 },
// //             shadowRadius: 8,
// //             elevation: 6,
// //           },
// //         ]}
// //         onPress={handleNotifyAttendance}
// //       >
// //         <Text style={styles.attendButtonText}>Join</Text>
// //       </TouchableOpacity>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //   },
// //   scroll: {
// //     flex: 1,
// //   },
// //   scrollContent: {
// //     paddingBottom: 120,
// //   },
// //   centered: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //   },
// //   errorText: {
// //     color: 'red',
// //     fontSize: 16,
// //     textAlign: 'center',
// //     fontFamily: 'GothamMedium',
// //   },
// //   headerContainer: {
// //     position: 'absolute',
// //     top: 16,
// //     left: 16,
// //     zIndex: 10,
// //     padding: 8,
// //     backgroundColor: 'rgba(255,255,255,0.95)',
// //     borderRadius: 12,
// //   },
// //   titleWrapper: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginBottom: 16,
// //     paddingVertical: 10,
// //   },
// //   headerTitle: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: '#111',
// //     textAlign: 'center',
// //     fontFamily: 'GothamBold',
// //   },
// //   imageContainer: {
// //     width: '100%',
// //     height: SCREEN_HEIGHT * 0.55,
// //     overflow: 'hidden',
// //   },
// //   image: {
// //     width: '100%',
// //     height: '100%',
// //   },
// //   infoContainer: {
// //     padding: 24,
// //     backgroundColor: '#fff',
// //     borderTopLeftRadius: 32,
// //     borderTopRightRadius: 32,
// //     marginTop: -32,
// //     borderWidth: 0, // Ensure no border appears
// //   },
// //   infoText: {
// //     fontSize: 15,
// //     color: '#333',
// //     lineHeight: 24,
// //     marginBottom: 16,
// //     fontFamily: 'GothamRegular',
// //   },
// //   detailRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   detailText: {
// //     fontSize: 12,
// //     fontWeight: '500',
// //     color: '#333',
// //     marginLeft: 8,
// //     fontFamily: 'GothamMedium',
// //   },
// //   iconRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'flex-start',
// //     alignItems: 'center',
// //   },
// //   smallIconButton: {
// //     marginRight: 16,
// //     padding: 8,
// //     backgroundColor: '#f8f8f8',
// //     borderRadius: 12,
// //   },
// //   attendButton: {
// //     position: 'absolute',
// //     bottom: 32,
// //     left: 24,
// //     right: 24,
// //     backgroundColor: GOLD,
// //     paddingVertical: 16,
// //     borderRadius: 24,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     borderWidth: 0, // Ensure no border appears
// //   },
// //   attendButtonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     fontFamily: 'GothamBold',
// //   },
// // });
// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ActivityIndicator,
//   Animated,
//   ScrollView,
//   Image,
//   SafeAreaView,
//   TouchableOpacity,
//   Alert,
//   Dimensions,
//   Share,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { BASE_URL } from './apiConfig';

// const GOLD = '#FF8C00';
// const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// export default function EventDetailScreen() {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const [eventData, setEventData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const scrollY = React.useRef(new Animated.Value(0)).current;
//   const dropUpAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

//   const eventId = route?.params?.id;

//   useEffect(() => {
//     if (!eventId) {
//       setError('No event ID provided.');
//       setLoading(false);
//       return;
//     }

//     const fetchEventDetails = async (retries = 3, delay = 1000) => {
//       try {
//         const token = await AsyncStorage.getItem('userToken');
//          console.log(token);
//         if (!token) {
//           throw new Error('No authentication token found. Please log in.');
//         }

//         for (let attempt = 1; attempt <= retries; attempt++) {
//           try {
//             const response = await fetch(`${BASE_URL}/events/${eventId}`, {
//               headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`,
//               },
//             });
//             console.log(`Attempt ${attempt} - Fetch event ${eventId} - Status:`, response.status);
//             if (!response.ok) {
//               if (response.status === 500) {
//                 throw new Error('Server error occurred. Please try again later or contact support.'+error);
//               }
//               if (response.status === 401) {
//                 throw new Error('Unauthorized. Please log in again.');
//               }
//               if (response.status === 404) {
//                 throw new Error('Event not found. Please check the event ID.');
//               }
//               throw new Error(`HTTP error! status: ${response.status}`);
//             }

//             const text = await response.text();
//             console.log(`Attempt ${attempt} - Raw response:`, text);
//             let json;
//             try {
//               json = JSON.parse(text);
//             } catch (parseErr) {
//               throw new Error('Invalid response format from server.');
//             }

//             if (json.success && json.data) {
//               setEventData(json.data);
//               return;
//             } else {
//               throw new Error('Failed to load event details: Invalid response format.');
//             }
//           } catch (err) {
//             console.log(`Attempt ${attempt} - Error:`, err.message);
//             if (attempt === retries) {
//               throw err;
//             }
//             await new Promise((resolve) => setTimeout(resolve, delay));
//           }
//         }
//       } catch (err) {
//         setError(err.message || 'Unknown error while fetching event.');
//         console.error('Fetch event error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEventDetails();

//     // Animate drop-up effect
//     Animated.timing(dropUpAnim, {
//       toValue: 0,
//       duration: 800,
//       useNativeDriver: true,
//     }).start();
//   }, [eventId]);

//   const handleNotifyAttendance = async () => {
//     try {
//       const token = await AsyncStorage.getItem('userToken');
     
//       if (!token) {
//         throw new Error('No authentication token found. Please log in.');
//       }

//       const response = await fetch(`${BASE_URL}/events/notify/${eventId}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Unauthorized. Please log in again.');
//         }
//         if (response.status === 404) {
//           throw new Error('Event not found. Please check the event ID.');
//         }
//         throw new Error(`Failed to notify. Status: ${response.status}`);
//       }

//       const text = await response.text();
//       console.log('Notify response:', text);
//       let json;
//       try {
//         json = JSON.parse(text);
//       } catch (parseErr) {
//         throw new Error('Invalid response format from server.');
//       }

//       if (json.success && json.data) {
//         setEventData((prevData) => ({
//           ...prevData,
//           attended: json.data.attended,
//         }));
//         Alert.alert(
//           'Success',
//           json.data.attended
//             ? 'You have successfully confirmed your attendance!'
//             : 'You have successfully withdrawn your attendance!'
//         );
//       } else {
//         throw new Error('Failed to update attendance status: Invalid response format.');
//       }
//     } catch (err) {
//       Alert.alert('Error', err.message || 'Failed to notify attendance. Please try again.');
//       console.error('Notify error:', err);
//     }
//   };

//   const handleShare = async () => {
//     try {
//       const result = await Share.share({
//         message: `Join me at ${eventData.name}! ${eventData.description} on ${new Date(eventData.eventDate).toLocaleDateString()}. Location: ${eventData.street}, ${eventData.district}, ${eventData.region}.`,
//         url: eventData.imageUrl || '',
//         title: eventData.name,
//       });

//       if (result.action === Share.sharedAction) {
//         // Shared successfully
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to share the event.');
//       console.error('Share error:', error);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color={GOLD} />
//       </View>
//     );
//   }

//   if (error || !eventData) {
//     return (
//       <View style={styles.centered}>
//         <Text style={styles.errorText}>{error || 'No event data found.'}</Text>
//       </View>
//     );
//   }

//   const imageScale = scrollY.interpolate({
//     inputRange: [-100, 0],
//     outputRange: [1.2, 1],
//     extrapolate: 'clamp',
//   });

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Back Arrow at Top */}
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={() => navigation.navigate('main', { screen: 'bible' })}>
//           <Ionicons name="arrow-back" size={24} color={GOLD} />
//         </TouchableOpacity>
//       </View>

//       {/* Content */}
//       <Animated.ScrollView
//         style={styles.scroll}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
//         scrollEventThrottle={16}
//       >
//         {/* Full Screen Image */}
//         <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
//           <Image
//             source={{
//               uri: eventData.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s',
//             }}
//             style={styles.image}
//             resizeMode="cover"
//           />
//         </Animated.View>

//         {/* Drop-Up Info Section */}
//         <Animated.View
//           style={[
//             styles.infoContainer,
//             { transform: [{ translateY: dropUpAnim }] },
//             !loading && {
//               shadowColor: '#000',
//               shadowOpacity: 0.1,
//               shadowOffset: { width: 0, height: -2 },
//               shadowRadius: 8,
//               elevation: 5,
//             },
//           ]}
//         >
//           {/* Centered Event Name */}
//           <View style={styles.titleWrapper}>
//             <Text style={styles.headerTitle} numberOfLines={2}>
//               {eventData.name}
//             </Text>
//           </View>

//           <Text style={styles.infoText}>
//             {`${eventData.description || 'No description provided.'}`}
//           </Text>
//           <View style={styles.detailRow}>
//             <Ionicons name="location-outline" size={16} color={GOLD} />
//             <Text style={styles.detailText}>
//               {`${eventData.street}, ${eventData.district}, ${eventData.region}`}
//             </Text>
//           </View>
//           <View style={styles.detailRow}>
//             <Ionicons name="calendar-outline" size={16} color={GOLD} />
//             <Text style={styles.detailText}>
//               {new Date(eventData.eventDate).toLocaleDateString(undefined, {
//                 weekday: 'long',
//                 year: 'numeric',
//                 month: 'long',
//                 day: 'numeric',
//               })}
//             </Text>
//           </View>
//           <View style={styles.iconRow}>
//             <TouchableOpacity style={styles.smallIconButton} onPress={handleShare}>
//               <Ionicons name="share-social-outline" size={16} color={GOLD} />
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.smallIconButton} onPress={handleNotifyAttendance}>
//               <Ionicons
//                 name={eventData.attended ? 'close-circle-outline' : 'checkmark-circle-outline'}
//                 size={16}
//                 color={GOLD}
//               />
//             </TouchableOpacity>
//           </View>
//         </Animated.View>
//       </Animated.ScrollView>

//       {/* Floating Attend Button */}
//       <TouchableOpacity
//         style={[
//           styles.attendButton,
//           !loading && {
//             shadowColor: '#000',
//             shadowOpacity: 0.15,
//             shadowOffset: { width: 0, height: 4 },
//             shadowRadius: 8,
//             elevation: 6,
//           },
//         ]}
//         onPress={handleNotifyAttendance}
//       >
//         <Text style={styles.attendButtonText}>
//           {eventData.attended ? 'I Will Not Be There' : 'I Will Be There'}
//         </Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   scroll: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 120,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     textAlign: 'center',
//     fontFamily: 'GothamMedium',
//   },
//   headerContainer: {
//     position: 'absolute',
//     top: 16,
//     left: 16,
//     zIndex: 10,
//     padding: 8,
//     backgroundColor: 'rgba(255,255,255,0.95)',
//     borderRadius: 12,
//   },
//   titleWrapper: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 16,
//     paddingVertical: 10,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111',
//     textAlign: 'center',
//     fontFamily: 'GothamBold',
//   },
//   imageContainer: {
//     width: '100%',
//     height: SCREEN_HEIGHT * 0.55,
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   infoContainer: {
//     padding: 24,
//     backgroundColor: '#fff',
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     marginTop: -32,
//     borderWidth: 0,
//   },
//   infoText: {
//     fontSize: 15,
//     color: '#333',
//     lineHeight: 24,
//     marginBottom: 16,
//     fontFamily: 'GothamRegular',
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   detailText: {
//     fontSize: 12,
//     fontWeight: '500',
//     color: '#333',
//     marginLeft: 8,
//     fontFamily: 'GothamMedium',
//   },
//   iconRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//   },
//   smallIconButton: {
//     marginRight: 16,
//     padding: 8,
//     backgroundColor: '#f8f8f8',
//     borderRadius: 12,
//   },
//   attendButton: {
//     position: 'absolute',
//     bottom: 32,
//     left: 24,
//     right: 24,
//     backgroundColor: GOLD,
//     paddingVertical: 16,
//     borderRadius: 24,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 0,
//   },
//   attendButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//     fontFamily: 'GothamBold',
//   },
// });

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiConfig';

const GOLD = '#E18731'; // Match EventsScreen GOLD color
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const dropUpAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Extract eventId from route params
  const eventId = route?.params?.id;

  useEffect(() => {
    // Log route params for debugging
    console.log('EventDetailScreen: route.params:', route.params);
    console.log('EventDetailScreen: eventId received:', eventId);

    // Validate eventId
    if (!eventId || typeof eventId !== 'string') {
      console.warn('EventDetailScreen: Invalid or missing event ID:', eventId);
      setError('No valid event ID provided. Please select an event.');
      setLoading(false);
      navigation.navigate('main', { screen: 'events' });
      return;
    }

    const fetchEventDetails = async (retries = 3, delay = 1000) => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log('EventDetailScreen: Token retrieved:', token ? 'Valid token' : 'No token');
        console.log(token)
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        for (let attempt = 1; attempt <= retries; attempt++) {
          console.log(`EventDetailScreen: Attempt ${attempt} - Fetching event ${eventId}`);
          try {
            const response = await fetch(`${BASE_URL}/events/${eventId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
            });
            console.log(`EventDetailScreen: Fetch status: ${response.status}`);

            if (!response.ok) {
              if (response.status === 401) {
                throw new Error('Unauthorized. Please log in again.');
              }
              if (response.status === 404) {
                throw new Error('Event not found. Please check the event ID.');
              }
              if (response.status === 500) {
                throw new Error('Server error occurred. Please try again later.');
              }
              throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const json = await response.json();
            console.log('EventDetailScreen: API response:', json);

            if (json.code === 200 && json.success && json.data) {
              setEventData({
                ...json.data,
                imageUrl: json.data.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s',
              });
              console.log('EventDetailScreen: Event data set:', json.data);
              return;
            } else {
              throw new Error(json.message || 'Failed to load event details: Invalid response format.');
            }
          } catch (err) {
            console.log(`EventDetailScreen: Attempt ${attempt} - Error:`, err.message);
            if (attempt === retries) {
              throw err;
            }
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      } catch (err) {
        setError(err.message || 'Unknown error while fetching event.');
        console.error('EventDetailScreen: Fetch event error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();

    // Animate drop-up effect
    Animated.timing(dropUpAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [eventId, navigation]);

  const handleNotifyAttendance = async () => {
    if (!eventId || typeof eventId !== 'string') {
      Alert.alert('Error', 'No valid event ID provided. Please select an event.');
      console.warn('EventDetailScreen: handleNotifyAttendance - Invalid eventId:', eventId);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('EventDetailScreen: Notify - Token retrieved:', token ? 'Valid token' : 'No token');
      if (!token) {
        Alert.alert('Error', 'No authentication token found. Please log in.');
        console.warn('EventDetailScreen: handleNotifyAttendance - No token');
        navigation.navigate('GetStarted');
        return;
      }

      console.log(`EventDetailScreen: Notifying attendance for event ${eventId}`);
      const response = await fetch(`${BASE_URL}/events/notify/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized. Please log in again.');
        }
        if (response.status === 404) {
          throw new Error('Event not found. Please check the event ID.');
        }
        if (response.status === 500) {
          throw new Error('Server error occurred. Please try again later.');
        }
        throw new Error(`Failed to notify. Status: ${response.status}`);
      }

      const json = await response.json();
      console.log('EventDetailScreen: Notify response:', json);

      if (json.success && json.data && typeof json.data.attended === 'boolean') {
        setEventData((prevData) => ({
          ...prevData,
          attended: json.data.attended,
        }));
        Alert.alert(
          'Success',
          json.data.attended
            ? 'You have successfully confirmed your attendance!'
            : 'You have successfully withdrawn your attendance!'
        );
      } else {
        throw new Error(json.message || 'Failed to update attendance status: Invalid response format.');
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to notify attendance. Please try again.');
      console.error('EventDetailScreen: Notify error:', err);
      if (err.message.includes('Unauthorized')) {
        navigation.navigate('GetStarted');
      }
    }
  };

  const handleShare = async () => {
    if (!eventData) {
      Alert.alert('Error', 'No event data available to share.');
      return;
    }

    try {
      const result = await Share.share({
        message: `Join me at ${eventData.name}! ${eventData.description} on ${new Date(eventData.eventDate).toLocaleDateString()}. Location: ${eventData.street}, ${eventData.district}, ${eventData.region}.`,
        url: eventData.imageUrl || '',
        title: eventData.name,
      });

      if (result.action === Share.sharedAction) {
        console.log('EventDetailScreen: Event shared successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share the event.');
      console.error('EventDetailScreen: Share error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={GOLD} />
        <Text style={styles.loaderText}>Loading Event...</Text>
      </View>
    );
  }

  if (error || !eventData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'No event data found.'}</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('main', { screen: 'events' })}
        >
          <Text style={styles.backButtonText}>Back to Events</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Arrow at Top */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('main', { screen: 'events' })}>
          <Ionicons name="arrow-back" size={24} color={GOLD} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
      >
        {/* Full Screen Image */}
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
          <Image
            source={{
              uri: eventData.imageUrl,
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Drop-Up Info Section */}
        <Animated.View
          style={[
            styles.infoContainer,
            { transform: [{ translateY: dropUpAnim }] },
            !loading && {
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: -2 },
              shadowRadius: 8,
              elevation: 5,
            },
          ]}
        >
          {/* Centered Event Name */}
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle} numberOfLines={2}>
              {eventData.name}
            </Text>
          </View>

          <Text style={styles.infoText}>
            {eventData.description || 'No description provided.'}
          </Text>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color={GOLD} />
            <Text style={styles.detailText}>
              {`${eventData.street}, ${eventData.district}, ${eventData.region}`}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={GOLD} />
            <Text style={styles.detailText}>
              {new Date(eventData.eventDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.smallIconButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={16} color={GOLD} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallIconButton} onPress={handleNotifyAttendance}>
              <Ionicons
                name={eventData.attended ? 'close-circle-outline' : 'checkmark-circle-outline'}
                size={16}
                color={GOLD}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Attend Button */}
      <TouchableOpacity
        style={[
          styles.attendButton,
          !loading && {
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 4 },
            shadowRadius: 8,
            elevation: 6,
          },
        ]}
        onPress={handleNotifyAttendance}
      >
        <Text style={styles.attendButtonText}>
          {eventData.attended ? 'Cancel Attendance' : 'I Will Be There'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'GothamMedium',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: GOLD,
    fontFamily: 'GothamMedium',
  },
  backButton: {
    marginTop: 20,
    backgroundColor: GOLD,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'GothamBold',
  },
  headerContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
  },
  titleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
    fontFamily: 'GothamBold',
  },
  imageContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.55,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    borderWidth: 0,
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'GothamRegular',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
    fontFamily: 'GothamMedium',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  smallIconButton: {
    marginRight: 16,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  attendButton: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    backgroundColor: GOLD,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  attendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'GothamBold',
  },
});