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
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiConfig'; // ✅ Correct path

const GOLD = '#FFA500';
const SCREEN_WIDTH = Dimensions.get('window').width;
const API_BASE = BASE_URL;


export default function CommunityDetail() {
  const { communityId } = useLocalSearchParams();
  const router = useRouter();

  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCommunity = async () => {
      if (!communityId) {
        console.log('No communityId found in params');
        return;
      }

      try {
        setLoading(true);
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'User not authenticated. Please login.');
          return;
        }

        const res = await fetch(`${API_BASE}/communities/${communityId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();

        if (res.ok && json.success && json.data) {
          if (isMounted) {
            setCommunity({ ...json.data, isMember: json.data.joined });
          }
        } else {
          if (isMounted) setError(json.message || 'Failed to fetch community data');
        }
      } catch (err) {
        if (isMounted) setError('Network error: ' + err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCommunity();

    return () => {
      isMounted = false;
    };
  }, [communityId]);

  const joinCommunity = async () => {
    if (!community) return;
    setActionLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated.');
        setActionLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/communities/${communityId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setCommunity(prev => ({ ...prev, isMember: true }));
        Alert.alert('Success', 'You have joined the community.');
      } else {
        Alert.alert('Error', json.message || 'Failed to join community.');
      }
    } catch (err) {
      Alert.alert('Error', `Network error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const leaveCommunity = async () => {
    if (!community) return;

    setActionLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated.');
        setActionLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/communities/${communityId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setCommunity(prev => ({ ...prev, isMember: false }));
        Alert.alert('Success', 'You have left the community.');
        router.replace('main/community');
      } else {
        Alert.alert('Error', json.message || 'Failed to leave community.');
      }
    } catch (err) {
      Alert.alert('Error', `Network error: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  const leaveCommunityWithConfirm = () => {
    Alert.alert(
      'Confirm Leave',
      'Are you sure you want to leave this community?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: leaveCommunity },
      ],
      { cancelable: true }
    );
  };

  const handleMembershipToggle = () => {
    if (!community) return;
    if (community.isMember) {
      leaveCommunity();
      // To re-enable confirmation dialog, replace with leaveCommunityWithConfirm();
    } else {
      joinCommunity();
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={GOLD} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!community) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>No community data available.</Text>
      </SafeAreaView>
    );
  }

  const logoUri = community.logo?.startsWith('http')
    ? community.logo
    : `${API_BASE}/${community.logo}`;

  // Icon mapping for fields
  const iconMap = {
    Description: <Ionicons name="document-text" size={16} color={GOLD} />,
    Region: <Entypo name="map" size={16} color={GOLD} />,
    District: <MaterialIcons name="location-city" size={16} color={GOLD} />,
    Street: <Ionicons name="location-sharp" size={16} color={GOLD} />,
    'Phone Number': <Ionicons name="call" size={16} color={GOLD} />,
    Email: <MaterialIcons name="email" size={16} color={GOLD} />,
  };

  const FieldCard = ({ label, value }) => (
    <View style={styles.card}>
      <View style={styles.labelContainer}>
        {iconMap[label]}
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={GOLD} />
          </TouchableOpacity>
          <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">
            {community.name}
          </Text>
        </View>

        <View style={styles.logoContainer}>
          <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="cover" />
        </View>

        <FieldCard label="Description" value={community.description} />
        <FieldCard label="Region" value={community.region} />
        <FieldCard label="District" value={community.district} />
        <FieldCard label="Street" value={community.street} />
        <FieldCard label="Phone Number" value={community.phoneNo} />
        <FieldCard label="Email" value={community.email} />

        <TouchableOpacity
          style={[
            styles.actionButton,
            community.isMember ? styles.leaveButton : styles.joinButton,
          ]}
          onPress={handleMembershipToggle}
          disabled={actionLoading}
          activeOpacity={0.7}
        >
          <Text style={styles.actionText}>
            {actionLoading
              ? 'Processing...'
              : community.isMember
              ? 'Unfollow Community'
              : 'Follow Community'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  scrollContainer: {
    paddingHorizontal: 10,
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: SCREEN_WIDTH - 20,
    marginBottom: 20,
    marginLeft: 10,
  },
  backButton: {
    paddingRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
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
    width: SCREEN_WIDTH - 20,
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: GOLD,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },
  value: {
    color: '#333',
    fontSize: 14,
  },
  actionButton: {
    width: SCREEN_WIDTH - 20,
    borderRadius: 8,
    paddingVertical: 14,
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
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
