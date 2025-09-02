import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from './apiConfig'; // ✅ Correct path

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Get token from storage
      if (!token) {
        console.warn('No auth token found');
        setNotifications([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${BASE_URL}/notifications/user/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send token in header
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        console.error('Unexpected response format:', data);
        setNotifications([]);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const hasUnread = Array.isArray(notifications)
    ? notifications.some((n) => !n.readAt)
    : false;

  const renderNotification = ({ item }) => (
    <View
      style={[
        styles.notificationCard,
        !item.readAt && styles.unreadNotification,
      ]}
    >
      <View style={styles.notificationHeader}>
        <Text
          style={[
            styles.notificationTitle,
            !item.readAt && { color: '#FF8C00' },
          ]}
        >
          {item.title || 'Untitled'}
        </Text>
        {!item.readAt && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationMessage} numberOfLines={2}>
        {item.message || 'No message'}
      </Text>
      <Text style={styles.notificationDate}>
        {new Date(item.createdAt).toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('main/index1'); // fallback route (home)
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color="#FF8C00" />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {hasUnread && <View style={styles.headerDot} />}
        </View>

        <View style={{ width: 20 }} />
      </View>

      {/* Notifications List */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#FF8C00"
          style={{ marginTop: 50 }}
        />
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color="#FF8C00"
          />
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubText}>
            Once you receive notifications, they’ll appear here.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  headerDot: {
    marginLeft: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF', // Blue dot for unread
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  unreadNotification: {
    borderColor: '#FF8C00',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF8C00',
  },
  notificationMessage: {
    fontSize: 12,
    color: '#444',
    marginBottom: 6,
  },
  notificationDate: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C00',
  },
  emptySubText: {
    marginTop: 6,
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});
