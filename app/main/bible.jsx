// import React, { useState } from 'react';
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
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';

// const events = [
//   {
//     id: '1',
//     date: '12',
//     month: 'Mar',
//     title: 'Celebrate Recovery',
//     description: 'Pass over from all the evil...',
//     location: 'Tegeta Nyuki Dar es Salaam',
//     image: 'https://via.placeholder.com/100x100/800080/FFFFFF?text=LENT',
//   },
//   {
//     id: '2',
//     date: '19',
//     month: 'Mar',
//     title: 'Matters of the Blood',
//     description: 'Come join pastor Tony blood...',
//     location: 'Millenium Towers Dar, 05:00 PM',
//     image: 'https://via.placeholder.com/100x100/8B0000/FFFFFF?text=BLOOD',
//   },
//   {
//     id: '3',
//     date: '29',
//     month: 'Mar',
//     title: 'Good Friday Service',
//     description: 'You are welcome at passover...',
//     location: 'Bahari Beach Dar es Salaam',
//     image: 'https://via.placeholder.com/100x100/00008B/FFFFFF?text=FRIDAY',
//   },
//   {
//     id: '4',
//     date: '31',
//     month: 'Mar',
//     title: 'Easter Service',
//     description: 'Jesus is risen Aleluyah',
//     location: 'St Joseph Cathedral Dar, 07:00 AM',
//     image: 'https://via.placeholder.com/100x100/FFD700/000000?text=EASTER',
//   },
// ];

// export default function EventsScreen() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigation = useNavigation();

//   const filteredEvents = events.filter(event =>
//     `${event.title} ${event.description} ${event.location}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase())
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
//               <Ionicons name="arrow-back" size={22} color="#FF8C00" />
//             </TouchableOpacity>
//             <Text style={styles.headerText}>Events</Text>
//             <TouchableOpacity
//               onPress={() => navigation.navigate('notification')}
//               style={styles.iconButton}
//             >
//               <Ionicons name="notifications-outline" size={22} color="#FF8C00" />
//             </TouchableOpacity>
//           </View>

//           {/* Search Bar */}
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

//           {/* Events List */}
//           <FlatList
//             data={filteredEvents}
//             keyExtractor={item => item.id}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
//             ListEmptyComponent={
//               <Text style={styles.noResults}>No matching events found.</Text>
//             }
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 style={styles.card}
//                 activeOpacity={0.8}
//                 onPress={() => navigation.navigate('events', { event: item })}
//               >
//                 <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
//                 <View style={styles.dateBadge}>
//                   <Text style={styles.dateText}>{item.date}</Text>
//                   <Text style={styles.monthText}>{item.month}</Text>
//                 </View>
//                 <View style={styles.info}>
//                   <Text style={styles.title}>{item.title}</Text>
//                   <Text style={styles.description}>{item.description}</Text>
//                   <Text style={styles.location}>{item.location}</Text>
//                 </View>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeContainer: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 24,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   headerText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#222',
//   },
//   iconButton: {
//     padding: 6,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FAFAFA',
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderWidth: 1,
//     borderColor: '#FF8C00',
//     marginBottom: 18,
//   },
//   searchIcon: {
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#222',
//     paddingVertical: 0,
//   },
//   noResults: {
//     textAlign: 'center',
//     marginTop: 28,
//     color: '#999',
//     fontSize: 13,
//   },
//   card: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     marginBottom: 14,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 4,
//   },
//   image: {
//     width: 90,
//     height: 90,
//   },
//   dateBadge: {
//     position: 'absolute',
//     top: 8,
//     left: 8,
//     backgroundColor: '#FF8C00',
//     paddingVertical: 3,
//     paddingHorizontal: 7,
//     borderRadius: 6,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 4,
//     shadowColor: '#FF8C00',
//     shadowOpacity: 0.3,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 3,
//   },
//   dateText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 14,
//     lineHeight: 17,
//   },
//   monthText: {
//     color: '#fff',
//     fontSize: 10,
//     lineHeight: 12,
//   },
//   info: {
//     flex: 1,
//     padding: 12,
//     justifyContent: 'center',
//   },
//   title: {
//     fontWeight: '600',
//     fontSize: 14,
//     color: '#222',
//     marginBottom: 3,
//   },
//   description: {
//     fontSize: 11,
//     color: '#666',
//     marginBottom: 5,
//   },
//   location: {
//     fontSize: 10,
//     color: '#444',
//   },
// });

import React, { useRef, useState } from 'react';
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
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const GOLD = '#FF8C00';

const allEvents = [
  {
    id: '1',
    date: '12',
    month: 'Mar',
    title: 'Celebrate Recovery',
    description: 'Pass over from all the evil...',
    location: 'Tegeta Nyuki Dar es Salaam',
    image: 'https://via.placeholder.com/100x100/800080/FFFFFF?text=LENT',
  },
  {
    id: '2',
    date: '19',
    month: 'Mar',
    title: 'Matters of the Blood',
    description: 'Come join pastor Tony blood...',
    location: 'Millenium Towers Dar, 05:00 PM',
    image: 'https://via.placeholder.com/100x100/8B0000/FFFFFF?text=BLOOD',
  },
  {
    id: '3',
    date: '29',
    month: 'Mar',
    title: 'Good Friday Service',
    description: 'You are welcome at passover...',
    location: 'Bahari Beach Dar es Salaam',
    image: 'https://via.placeholder.com/100x100/00008B/FFFFFF?text=FRIDAY',
  },
  {
    id: '4',
    date: '31',
    month: 'Mar',
    title: 'Easter Service',
    description: 'Jesus is risen Aleluyah',
    location: 'St Joseph Cathedral Dar, 07:00 AM',
    image: 'https://via.placeholder.com/100x100/FFD700/000000?text=EASTER',
  },
];

// Simulate My Events
const myEvents = [allEvents[0], allEvents[2]];

export default function EventsScreen() {
  const navigation = useNavigation();
  const scrollRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('my');

  const filteredMyEvents = myEvents.filter(event =>
    `${event.title} ${event.description} ${event.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAllEvents = allEvents.filter(event =>
    `${event.title} ${event.description} ${event.location}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ x: tab === 'my' ? 0 : width, animated: true });
  };

  const handleScroll = (event) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    setActiveTab(xOffset < width / 2 ? 'my' : 'all');
  };

  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('events', { event: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <View style={styles.dateColumn}>
          <Text style={styles.dateText}>{item.date}</Text>
          <Text style={styles.monthText}>{item.month}</Text>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={22} color={GOLD} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('notification')} style={styles.iconButton}>
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
              <Text style={[styles.tabText, activeTab === 'my' ? styles.activeTab : styles.inactiveTab]}>
                My Events
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleTabPress('all')}>
              <Text style={[styles.tabText, activeTab === 'all' ? styles.activeTab : styles.inactiveTab]}>
                All Events
              </Text>
            </TouchableOpacity>
          </View>

          {/* Slider Content */}
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={{ flex: 1 }}
          >
            <View style={{ width }}>
              <FlatList
                data={filteredMyEvents}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
                ListEmptyComponent={<Text style={styles.noResults}>No events found.</Text>}
                renderItem={renderEventCard}
              />
            </View>
            <View style={{ width }}>
              <FlatList
                data={filteredAllEvents}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
                ListEmptyComponent={<Text style={styles.noResults}>No events found.</Text>}
                renderItem={renderEventCard}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    paddingVertical: 0,
  },

  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  activeTab: {
    color: GOLD,
    borderBottomWidth: 2,
    borderColor: GOLD,
    paddingBottom: 4,
  },
  inactiveTab: {
    color: '#888',
    paddingBottom: 4,
  },

  noResults: {
    textAlign: 'center',
    marginTop: 28,
    color: '#999',
    fontSize: 13,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: 90,
    height: 90,
    backgroundColor: '#eee',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  dateColumn: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: GOLD,
    borderRadius: 8,
    paddingVertical: 6,
  },
  dateText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  monthText: {
    color: '#fff',
    fontSize: 11,
  },
  detailColumn: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    color: '#222',
    marginBottom: 3,
  },
  description: {
    fontSize: 11,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 10,
    color: '#444',
  },
});
