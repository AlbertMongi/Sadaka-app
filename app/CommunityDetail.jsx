import React, { useEffect, useState, useRef } from 'react';
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
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from './apiConfig';

const GOLD = '#FFA500';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const API_BASE = BASE_URL;

export default function CommunityDetail() {
  const { communityId } = useLocalSearchParams();
  const router = useRouter();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const headerFadeAnim = useRef(new Animated.Value(0)).current;
  const logoScaleAnim = useRef(new Animated.Value(0)).current;
  const infoDropUpAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const buttonBounceAnim = useRef(new Animated.Value(1)).current;
  const modalSlideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

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

    // Animate header fade-in
    Animated.timing(headerFadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Animate logo scale
    Animated.timing(logoScaleAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Animate info section drop-up
    Animated.timing(infoDropUpAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate button bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonBounceAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonBounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      isMounted = false;
    };
  }, [communityId]);

  useEffect(() => {
    if (showConfirmModal) {
      Animated.timing(modalSlideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } else {
      modalSlideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [showConfirmModal]);

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
        router.navigate('main/community');
      } else {
        Alert.alert('Error', json.message || 'Failed to leave community.');
      }
    } catch (err) {
      Alert.alert('Error', `Network error: ${err.message}`);
    } finally {
      setActionLoading(false);
      setShowConfirmModal(false);
    }
  };

  const leaveCommunityWithConfirm = () => {
    setShowConfirmModal(true);
  };

  const handleMembershipToggle = () => {
    if (!community) return;
    if (community.isMember) {
      leaveCommunityWithConfirm();
    } else {
      joinCommunity();
    }
  };

  const closeConfirmModal = () => {
    Animated.timing(modalSlideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 400,
      useNativeDriver: true,
    }).start(() => setShowConfirmModal(false));
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

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.headerContainer, { opacity: headerFadeAnim }]}>
        <TouchableOpacity onPress={() => router.navigate('main/community')}>
          <Ionicons name="arrow-back" size={24} color={GOLD} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: logoScaleAnim } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: logoScaleAnim.interpolate({
          inputRange: [-100, 0],
          outputRange: [1.2, 1],
          extrapolate: 'clamp',
        }) }] }]}>
          <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="cover" />
        </Animated.View>

        <Animated.View style={[styles.infoContainer, { transform: [{ translateY: infoDropUpAnim }] }]}>
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {community.name}
          </Text>
          <Text style={styles.descriptionText}>
            {community.description || 'No description provided.'}
          </Text>
          <View style={styles.detailRow}>
            <Entypo name="map" size={16} color={GOLD} />
            <Text style={styles.detailText}>
              {community.region || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="location-city" size={16} color={GOLD} />
            <Text style={styles.detailText}>
              {community.district || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-sharp" size={16} color={GOLD} />
            <Text style={styles.detailText}>
              {community.street || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="call" size={16} color={GOLD} />
            <Text style={styles.detailText}>
              {community.phoneNo || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="email" size={16} color={GOLD} />
            <Text style={styles.detailText}>
              {community.email || 'N/A'}
            </Text>
          </View>
        </Animated.View>
      </Animated.ScrollView>

      <Animated.View style={[styles.actionButtonContainer, { transform: [{ scale: buttonBounceAnim }] }]}>
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
      </Animated.View>

      <Modal
        visible={showConfirmModal}
        animationType="none"
        transparent
        onRequestClose={closeConfirmModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeConfirmModal}>
          <Animated.View style={[styles.modalContainer, { transform: [{ translateY: modalSlideAnim }] }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Leave</Text>
              <TouchableOpacity onPress={closeConfirmModal}>
                <Ionicons name="close" size={24} color={GOLD} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>
              Are you sure you want to leave {community.name}?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeConfirmModal}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.leaveButton]}
                onPress={leaveCommunity}
                activeOpacity={0.7}
              >
                <Text style={styles.modalButtonText}>Leave</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
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
  headerContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  scrollContainer: {
    paddingBottom: 120,
    paddingTop: 0, // Adjusted to ensure image starts at top
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.55,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eee',
  },
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
    fontFamily: 'System',
  },
  descriptionText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
    fontFamily: 'System',
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
    fontFamily: 'System',
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
  },
  actionButton: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 6,
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
    fontFamily: 'System',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginHorizontal: 0,
    elevation: 5,
    width: SCREEN_WIDTH,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: GOLD,
    fontFamily: 'System',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'System',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    fontFamily: 'System',
  },
});