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
import { BASE_URL } from './apiConfig';

const GOLD = '#FF8C00';
const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EventDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const dropUpAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

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

    // Animate drop-up effect
    Animated.timing(dropUpAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
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

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Join me at ${eventData.name}! ${eventData.description} on ${new Date(eventData.eventDate).toLocaleDateString()}. Location: ${eventData.street}, ${eventData.district}, ${eventData.region}.`,
        url: eventData.imageUrl,
        title: eventData.name,
      });

      if (result.action === Share.sharedAction) {
        // Shared
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share the event.');
      console.error(error);
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

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Arrow at Top */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('main', { screen: 'bible' })}>
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
              uri: eventData.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s',
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
            // Apply shadow only after loading is complete
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
            {`${eventData.description || 'No description provided.'}`}
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
              <Ionicons name="checkmark-circle-outline" size={16} color={GOLD} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      {/* Floating Attend Button */}
      <TouchableOpacity
        style={[
          styles.attendButton,
          // Apply shadow only after loading is complete
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
        <Text style={styles.attendButtonText}>Join</Text>
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
    borderWidth: 0, // Ensure no border appears
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
    borderWidth: 0, // Ensure no border appears
  },
  attendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'GothamBold',
  },
});