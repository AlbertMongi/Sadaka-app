import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function EventDetailScreen() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const handleRSVP = () => {
    Alert.alert("Thank you!", "You've confirmed your attendance.");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event</Text>
        <View style={{ width: 24 }} /> {/* placeholder */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Event Image */}
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4' }}
          style={styles.eventImage}
          resizeMode="cover"
        />

        {/* Event Title */}
        <Text style={styles.eventTitle}>{name || 'Event Detail'}</Text>

        {/* Event Description */}
        <Text style={styles.eventDescription}>
          Join us for a powerful session led by <Text style={styles.highlight}>{name}</Text>. This event will focus on worship, spiritual growth,
          and community fellowship. Everyone is welcome. Bring your friends and family to experience the word
          of God in a life-changing way.
        </Text>

        {/* Event Details */}
        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={18} color="#444" />
            <Text style={styles.detailLabel}> Sunday, August 25, 2025</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#444" />
            <Text style={styles.detailLabel}> 10:00 AM - 12:00 PM</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#444" />
            <Text style={styles.detailLabel}> New Life Church Hall, Nairobi</Text>
          </View>
        </View>
      </ScrollView>

      {/* RSVP Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.rsvpButton} activeOpacity={0.8} onPress={handleRSVP}>
          <Text style={styles.rsvpButtonText}>I will be there</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCC',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  eventImage: {
    width: '100%',
    height: 240,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginTop: 28,
    marginHorizontal: 24,
  },
  highlight: {
    fontWeight: '700',
    color: '#000',
  },
  eventDescription: {
    fontSize: 14,
    color: '#444',
    marginTop: 14,
    marginHorizontal: 24,
    lineHeight: 22,
  },
  eventDetails: {
    marginTop: 32,
    marginHorizontal: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 13,
    color: '#444',
    marginLeft: 10,
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  rsvpButton: {
    backgroundColor: '#FFA500', // light orange
    paddingVertical: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  rsvpButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
