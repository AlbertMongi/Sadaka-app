import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const events = [
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

export default function EventsScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation();

  const filteredEvents = events.filter(event =>
    `${event.title} ${event.description} ${event.location}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color="#FF8C00" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('notification')}>
              <Ionicons name="notifications-outline" size={24} color="#FF8C00" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
            <TextInput
              placeholder="Search for an event"
              placeholderTextColor="#999"
              value={searchTerm}
              onChangeText={setSearchTerm}
              style={styles.searchInput}
            />
          </View>

          {/* Events List */}
          <FlatList
            data={filteredEvents}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            ListEmptyComponent={
              <Text style={styles.noResults}>No matching events found.</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() =>
                  navigation.navigate('events', { event: item })
                }
              >
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.dateBadge}>
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.monthText}>{item.month}</Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.location}>{item.location}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
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
    fontSize: 16,
    fontWeight: '600',
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
  },
  image: {
    width: 75,
    height: 75,
  },
  dateBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FF8C00',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
  },
  dateText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  monthText: {
    color: '#fff',
    fontSize: 10,
  },
  info: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    color: '#000',
    marginBottom: 3,
  },
  description: {
    fontSize: 12,
    color: '#666',
  },
  location: {
    marginTop: 4,
    fontSize: 11,
    color: '#444',
  },
});
