import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const GOLD = '#FFA500';
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CommunityDetail() {
  const { communityId } = useLocalSearchParams();
  const router = useRouter();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!communityId) return;

    const fetchCommunity = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://192.168.100.24:8000/api/communities/${communityId}`);
        const json = await res.json();

        if (res.ok && json.success && typeof json.data === 'object') {
          setCommunity(json.data);
          setError(null);
        } else {
          setError('Community not found');
        }
      } catch {
        setError('Failed to fetch community data');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [communityId]);

  const toggleMembership = async () => {
    if (!community) return;
    setActionLoading(true);

    const endpoint = community.isMember ? 'leave' : 'join';
    try {
      const res = await fetch(`http://192.168.100.24:8000/api/communities/${communityId}/${endpoint}`, {
        method: 'POST',
      });
      if (res.ok) {
        setCommunity({ ...community, isMember: !community.isMember });
      } else {
        Alert.alert('Error', `${community.isMember ? 'Leave' : 'Join'} request failed.`);
      }
    } catch {
      Alert.alert('Error', `Failed to ${community.isMember ? 'leave' : 'join'} community.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={GOLD} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!community) {
    return (
      <View style={styles.center}>
        <Text>No community data available.</Text>
      </View>
    );
  }

  const logoUri = community.logo?.startsWith('http')
    ? community.logo
    : `http://192.168.100.24:8000/${community.logo}`;

  const FieldCard = ({ label, value }) => (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('main/community')}>
        <Ionicons name="arrow-back" size={28} color={GOLD} />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="cover" />
      </View>

      <FieldCard label="Name" value={community.name} />
      <FieldCard label="Description" value={community.description} />
      <FieldCard label="Region" value={community.region} />
      <FieldCard label="District" value={community.district} />
      <FieldCard label="Street" value={community.street} />
      <FieldCard label="Phone Number" value={community.phoneNo} />
      <FieldCard label="Email" value={community.email} />

      <TouchableOpacity
        style={[styles.actionButton, community.isMember ? styles.leaveButton : styles.joinButton]}
        onPress={toggleMembership}
        disabled={actionLoading}
      >
        <Text style={styles.actionText}>
          {actionLoading
            ? 'Processing...'
            : community.isMember
            ? 'Leave Community'
            : 'Join Community'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  scrollContainer: {
    paddingTop: 90,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    paddingBottom: 60,
  },
  logoContainer: {
    backgroundColor: '#fff',
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eee',
  },
  card: {
    backgroundColor: '#fff',
    width: SCREEN_WIDTH * 0.8,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    color: GOLD,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  value: {
    color: '#333',
    fontSize: 15,
  },
  actionButton: {
    width: SCREEN_WIDTH * 0.8,
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: GOLD,
  },
  leaveButton: {
    backgroundColor: '#d9534f',
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
});
