import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BASE_URL } from './apiConfig'; // ✅ Correct path

const GOLD = '#FF8C00';

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const eventId = route?.params?.id;

  useEffect(() => {
    if (!eventId) {
      setError('No event ID provided.');
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}/events/${eventId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const json = await response.json();

        if (json.success && json.data) {
          setEventData(json.data);
        } else {
          setError('Failed to load event details.');
        }
      } catch (err) {
        setError('Network error while fetching event.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleNotifyAttendance = async () => {
    try {
      const response = await fetch(`${BASE_URL}/events/notify/${eventId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to notify. Status: ${response.status}`);
      }

      Alert.alert('Success', 'You have successfully confirmed your attendance!');
    } catch (err) {
      Alert.alert('Error', 'Failed to notify attendance. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={GOLD} />
      </View>
    );
  }

  if (error || !eventData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'No event data found.'}</Text>
      </View>
    );
  }

  const FieldCard = ({ icon, label, value }) => (
    <View style={styles.card}>
      <View style={styles.labelContainer}>
        {icon}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="arrow-back" size={24} color={GOLD} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {eventData.name}
          </Text>
          <View style={{ width: 24 }} />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Image */}
        <View style={styles.imageBox}>
          <Image
            source={{
              uri: eventData.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s',
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Description */}
        <FieldCard
          icon={<Ionicons name="document-text" size={16} color={GOLD} />}
          label="Description"
          value={eventData.description || 'No description provided.'}
        />

        {/* Location */}
        <FieldCard icon={<Entypo name="map" size={16} color={GOLD} />} label="Region" value={eventData.region} />
        <FieldCard icon={<MaterialIcons name="location-city" size={16} color={GOLD} />} label="District" value={eventData.district} />
        <FieldCard icon={<Ionicons name="location" size={16} color={GOLD} />} label="Street" value={eventData.street} />

        {/* Date */}
        <FieldCard
          icon={<Ionicons name="calendar" size={16} color={GOLD} />}
          label="Date"
          value={new Date(eventData.eventDate).toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        />
      </ScrollView>

      {/* Notify Button */}
      <TouchableOpacity style={styles.attendButton} onPress={handleNotifyAttendance}>
        <Text style={styles.attendButtonText}>I will be there</Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  imageBox: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    color: GOLD,
    fontWeight: '600',
    marginLeft: 6,
  },
  value: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  attendButton: {
    backgroundColor: GOLD,
    paddingVertical: 14,
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  attendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
