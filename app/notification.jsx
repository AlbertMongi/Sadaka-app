import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';  // <-- import useRouter

const notificationsData = [
  {
    id: '1',
    title: 'New Offering Received',
    message: 'You have received a new offering of TZS 50,000.',
    date: '2025-08-18 14:30',
    read: false,
  },
  {
    id: '2',
    title: 'Weekly Report',
    message: 'Your weekly giving report is now available.',
    date: '2025-08-17 09:00',
    read: true,
  },
  {
    id: '3',
    title: 'Thank You!',
    message: 'Thank you for your generous tithe this month.',
    date: '2025-08-15 12:15',
    read: true,
  },
];

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState(notificationsData);
  const router = useRouter(); // <-- initialize router

  const renderNotification = ({ item }) => {
    return (
      <View
        style={[
          styles.notificationCard,
          !item.read && styles.unreadNotification,
        ]}
      >
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, !item.read && {color: '#FF8C00'}]}>
            {item.title}
          </Text>
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.notificationDate}>
          {new Date(item.date).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}  // <-- use router.back()
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={20} color="#FF8C00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 20 }} />
      </View>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={64} color="#FF8C00" />
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
