import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Animated,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { BASE_URL } from './apiConfig'; // ✅ Adjust path as needed

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const GOLD = '#FF8C00';
const FALLBACK_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s';

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const dropUpAnim = React.useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  async function fetchWithToken(url) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  }

  useEffect(() => {
    if (!id) return;

    const loadSermon = async () => {
      const res = await fetchWithToken(`${BASE_URL}/sermons/${id}`);
      if (res?.success && res.data) setSermon(res.data);
      else setSermon(null);
      setLoading(false);
    };

    loadSermon();

    // Animate drop-up
    Animated.timing(dropUpAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={GOLD} />
      </View>
    );
  }

  if (!sermon) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Sermon not found.</Text>
      </View>
    );
  }

  const imageScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      {/* Back Arrow Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={GOLD} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
      >
        {/* Full-Screen Image */}
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: imageScale }] }]}>
          <Image
            source={{ uri: sermon.photo || FALLBACK_IMAGE }}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Drop-Up Info Section */}
        <Animated.View style={[styles.infoContainer, { transform: [{ translateY: dropUpAnim }] }]}>
          <Text style={styles.headerTitle}>{sermon.name}</Text>
          <Text style={styles.infoText}>
            {sermon.description || 'No description provided.'}
          </Text>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
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
  imageContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.55,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  infoContainer: {
    padding: 24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    fontFamily: 'GothamBold',
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    fontFamily: 'GothamRegular',
  },
});
