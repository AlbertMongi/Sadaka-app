import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const FALLBACK_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s';
const GOLD = '#FFA500';

export default function SermonDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [sermon, setSermon] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchWithToken(url) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      return json;
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  }

  useEffect(() => {
    if (!id) return;

    const loadSermon = async () => {
      const res = await fetchWithToken(`http://192.168.100.24:8000/api/sermons/${id}`);
      if (res?.success && res.data) {
        setSermon(res.data);
      } else {
        setSermon(null);
      }
      setLoading(false);
    };

    loadSermon();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={GOLD} />
      </View>
    );
  }

  if (!sermon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Sermon not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={GOLD} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sermon</Text>
      </View>

      <Image
        source={{ uri: sermon.photo || FALLBACK_IMAGE }}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>{sermon.name}</Text>
      {/* <Text style={styles.speaker}>By: {sermon.speaker || 'Unknown Speaker'}</Text> */}
      <Text style={styles.description}>{sermon.description || 'No description provided.'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f7f7f7',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  image: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  speaker: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 100,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#888',
  },
});
