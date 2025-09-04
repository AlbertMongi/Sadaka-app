// import React, { useEffect, useRef, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   FlatList,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { BASE_URL } from '../apiConfig'; // ✅ Correct path

// const { width } = Dimensions.get('window');
// const GOLD = '#f2b675';

// function formatDate(dateString) {
//   const dateObj = new Date(dateString);
//   const day = dateObj.getDate().toString().padStart(2, '0');
//   const month = dateObj.toLocaleString('default', { month: 'short' });
//   const hours = dateObj.getHours();
//   const minutes = dateObj.getMinutes().toString().padStart(2, '0');
//   const ampm = hours >= 12 ? 'PM' : 'AM';
//   const hour12 = hours % 12 === 0 ? 12 : hours % 12;
//   const time = `${hour12.toString()}:${minutes} ${ampm}`;
//   return { day, month, time };
// }

// export default function EventsScreen() {
//   const navigation = useNavigation();
//   const scrollRef = useRef();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [activeTab, setActiveTab] = useState('my');
//   const [allEvents, setAllEvents] = useState([]);
//   const [myEvents, setMyEvents] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`${BASE_URL}/events`);
//         const json = await response.json();

//         if (json.success && Array.isArray(json.data)) {
//           const enriched = json.data.map((evt) => {
//             const { day, month, time } = formatDate(evt.eventDate);
//             const locationText = `${evt.street}, ${evt.district}, ${evt.region}`;
//             return {
//               id: evt.id,
//               title: evt.name,
//               description: evt.description,
//               location: locationText,
//               day,
//               month,
//               time,
//               image:
//                 evt.imageUrl ||
//                 `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s`,
//             };
//           });

//           setAllEvents(enriched);
//           setMyEvents(enriched.slice(0, 2));
//         } else {
//           console.error('Invalid API response:', json);
//         }
//       } catch (err) {
//         console.error('Fetch error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const filteredMyEvents = myEvents.filter((evt) =>
//     `${evt.title} ${evt.description} ${evt.location}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );
//   const filteredAllEvents = allEvents.filter((evt) =>
//     `${evt.title} ${evt.description} ${evt.location}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
//   );

//   const handleTabPress = (tab) => {
//     setActiveTab(tab);
//     scrollRef.current?.scrollTo({ x: tab === 'my' ? 0 : width, animated: true });
//   };

//   const handleScroll = (e) => {
//     setActiveTab(e.nativeEvent.contentOffset.x < width / 2 ? 'my' : 'all');
//   };

//   const renderEventCard = ({ item }) => (
//     <TouchableOpacity
//       style={styles.card}
//       activeOpacity={0.9}
//       onPress={() => navigation.navigate('EventDetailScreen', { id: item.id })}
//     >
//       <View style={styles.imageWrapper}>
//         <Image source={{ uri: item.image }} style={styles.image} />
//         <View style={styles.dateBadge}>
//           <Text style={styles.dateDay}>{item.day}</Text>
//           <Text style={styles.dateMonth}>{item.month}</Text>
//         </View>
//       </View>
//       <View style={styles.info}>
//         {/* Removed numberOfLines here so title wraps */}
//         <Text style={styles.title}>
//           {item.title}
//         </Text>
//         <Text style={styles.dateInline}>{item.time}</Text>
//         <Text style={styles.location} numberOfLines={2}>
//           {item.location}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.safeContainer}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       >
//         <View style={styles.container}>
//           {/* Header */}
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
//               <Ionicons name="arrow-back" size={22} color={GOLD} />
//             </TouchableOpacity>
//             <Text style={styles.headerText}>Events</Text>
//             <TouchableOpacity
//               onPress={() => navigation.navigate('notification')}
//               style={styles.iconButton}
//             >
//               <Ionicons name="notifications-outline" size={22} color={GOLD} />
//             </TouchableOpacity>
//           </View>

//           {/* Search */}
//           <View style={styles.searchContainer}>
//             <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
//             <TextInput
//               placeholder="Search for an event"
//               placeholderTextColor="#999"
//               value={searchTerm}
//               onChangeText={setSearchTerm}
//               style={styles.searchInput}
//               clearButtonMode="while-editing"
//             />
//           </View>

//           {/* Tabs */}
//           <View style={styles.tabs}>
//             <TouchableOpacity onPress={() => handleTabPress('my')}>
//               <Text style={[styles.tabText, activeTab === 'my' ? styles.activeTab : styles.inactiveTab]}>
//                 My Events
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => handleTabPress('all')}>
//               <Text style={[styles.tabText, activeTab === 'all' ? styles.activeTab : styles.inactiveTab]}>
//                 All Events
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Event List */}
//           <View style={{ flex: 1 }}>
//             {loading ? (
//               <ActivityIndicator size="large" color={GOLD} style={{ marginTop: 20 }} />
//             ) : (
//               <ScrollView
//                 ref={scrollRef}
//                 horizontal
//                 pagingEnabled
//                 showsHorizontalScrollIndicator={false}
//                 onScroll={handleScroll}
//                 scrollEventThrottle={16}
//                 contentContainerStyle={{ flexGrow: 1 }}
//               >
//                 <View style={{ width, height: '100%' }}>
//                   <FlatList
//                     data={filteredMyEvents}
//                     keyExtractor={(i) => i.id.toString()}
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
//                     ListEmptyComponent={<Text style={styles.noResults}>No events found.</Text>}
//                     renderItem={renderEventCard}
//                   />
//                 </View>

//                 <View style={{ width, height: '100%' }}>
//                   <FlatList
//                     data={filteredAllEvents}
//                     keyExtractor={(i) => i.id.toString()}
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
//                     ListEmptyComponent={<Text style={styles.noResults}>No events found.</Text>}
//                     renderItem={renderEventCard}
//                   />
//                 </View>
//               </ScrollView>
//             )}
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeContainer: { flex: 1, backgroundColor: '#fff' },
//   container: { flex: 1, paddingHorizontal: 16, paddingTop: 20 },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   headerText: { fontSize: 18, fontWeight: '600', color: '#222' },
//   iconButton: { padding: 6 },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FAFAFA',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderWidth: 1,
//     borderColor: GOLD,
//     marginBottom: 12,
//   },
//   searchIcon: { marginRight: 8 },
//   searchInput: { flex: 1, fontSize: 14, color: '#222', paddingVertical: 0 },
//   tabs: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
//   tabText: { fontSize: 14, fontWeight: '600', marginHorizontal: 16 },
//   activeTab: { color: GOLD, borderBottomWidth: 2, borderColor: GOLD, paddingBottom: 4 },
//   inactiveTab: { color: '#888', paddingBottom: 4 },
//   noResults: { textAlign: 'center', marginTop: 28, color: '#999', fontSize: 13 },

//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 14,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   imageWrapper: {
//     width: 110, // Rectangular
//     height: 80,
//     borderRadius: 8,
//     overflow: 'hidden',
//     marginRight: 16,
//     position: 'relative',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   },
//   dateBadge: {
//     position: 'absolute',
//     bottom: 6,
//     left: 6,
//     backgroundColor: '#000000cc',
//     paddingVertical: 2,
//     paddingHorizontal: 6,
//     borderRadius: 4,
//     alignItems: 'center',
//   },
//   dateDay: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   dateMonth: {
//     color: '#fff',
//     fontSize: 10,
//     textAlign: 'center',
//     textTransform: 'uppercase',
//     marginTop: 0,
//   },
//   info: {
//     flex: 1,
//   },
//   title: {
//     fontWeight: '500',
//     fontSize: 14,
//     color: '#1c1414',
//     marginBottom: 4,
//   },
//   dateInline: {
//     color: GOLD,
//     fontWeight: '600',
//     fontSize: 12,
//     marginBottom: 2,
//   },
//   location: {
//     fontSize: 11,
//     color: '#777',
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../apiConfig';

const GOLD = '#f2b675';

function formatDate(dateString) {
  const dateObj = new Date(dateString);
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const time = `${hour12.toString()}:${minutes} ${ampm}`;
  return { day, month, time };
}

export default function EventsScreen() {
  const navigation = useNavigation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my');
  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/events`);
        const json = await response.json();

        if (json.success && Array.isArray(json.data)) {
          const enriched = json.data.map((evt) => {
            const { day, month, time } = formatDate(evt.eventDate);
            const locationText = `${evt.street}, ${evt.district}, ${evt.region}`;
            return {
              id: evt.id,
              title: evt.name,
              description: evt.description,
              location: locationText,
              day,
              month,
              time,
              image:
                evt.imageUrl ||
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s',
            };
          });

          setAllEvents(enriched);
          setMyEvents(enriched.slice(0, 2));
        } else {
          console.error('Invalid API response:', json);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredMyEvents = myEvents.filter((evt) =>
    `${evt.title} ${evt.description} ${evt.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const filteredAllEvents = allEvents.filter((evt) =>
    `${evt.title} ${evt.description} ${evt.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EventDetailScreen', { id: item.id })}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.dateBadge}>
          <Text style={styles.dateDay}>{item.day}</Text>
          <Text style={styles.dateMonth}>{item.month}</Text>
        </View>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.dateInline}>{item.time}</Text>
        <Text style={styles.location} numberOfLines={2}>
          {item.location}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={22} color={GOLD} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Events</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('notification')}
              style={styles.iconButton}
            >
              <Ionicons name="notifications-outline" size={22} color={GOLD} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
            <TextInput
              placeholder="Search for an event"
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
              clearButtonMode="while-editing"
            />
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => handleTabPress('my')}>
              <Text
                style={[styles.tabText, activeTab === 'my' ? styles.activeTab : styles.inactiveTab]}
              >
                My Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabPress('all')}>
              <Text
                style={[styles.tabText, activeTab === 'all' ? styles.activeTab : styles.inactiveTab]}
              >
                All Events
              </Text>
            </TouchableOpacity>
          </View>

          {/* Event List */}
          <View style={{ flex: 1 }}>
            {loading ? (
              <ActivityIndicator size="large" color={GOLD} style={{ marginTop: 20 }} />
            ) : (
              <View style={{ flex: 1 }}>
                {activeTab === 'my' ? (
                  <FlatList
                    data={filteredMyEvents}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
                    ListEmptyComponent={<Text style={styles.noResults}>No events found.</Text>}
                    renderItem={renderEventCard}
                  />
                ) : (
                  <FlatList
                    data={filteredAllEvents}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
                    ListEmptyComponent={<Text style={styles.noResults}>No events found.</Text>}
                    renderItem={renderEventCard}
                  />
                )}
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? -100 : 50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: { fontSize: 18, fontWeight: '600', color: '#222' },
  iconButton: { padding: 6 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: GOLD,
    marginBottom: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#222', paddingVertical: 0 },
  tabs: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  tabText: { fontSize: 14, fontWeight: '600', marginHorizontal: 16 },
  activeTab: { color: GOLD, borderBottomWidth: 2, borderColor: GOLD, paddingBottom: 4 },
  inactiveTab: { color: '#888', paddingBottom: 4 },
  noResults: { textAlign: 'center', marginTop: 28, color: '#999', fontSize: 13 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrapper: {
    width: 110,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dateBadge: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: '#000000cc',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  dateDay: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  dateMonth: {
    color: '#fff',
    fontSize: 10,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginTop: 0,
  },
  info: {
    flex: 1,
  },
  title: {
    fontWeight: '500',
    fontSize: 14,
    color: '#1c1414',
    marginBottom: 4,
  },
  dateInline: {
    color: GOLD,
    fontWeight: '600',
    fontSize: 12,
    marginBottom: 2,
  },
  location: {
    fontSize: 11,
    color: '#777',
  },
});