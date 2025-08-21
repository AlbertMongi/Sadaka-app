import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ORANGE = '#DD863C';

const communitiesData = [
  {
    id: '1',
    name: 'Man of Victory',
    image: 'https://i.imgur.com/WvX12hX.png',
    groups: [
      { id: 'g1', name: 'Group 1', description: 'Group one description' },
      { id: 'g2', name: 'Group 2', description: 'Group two description' },
      { id: 'g3', name: 'Group 3', description: 'Group three description' },
    ],
  },
  {
    id: '2',
    name: 'Cornerstone',
    image: 'https://i.imgur.com/aPY4xXT.png',
    groups: [
      { id: 'g4', name: 'Group 1', description: 'Group one description' },
      { id: 'g5', name: 'Group 2', description: 'Group two description' },
      { id: 'g6', name: 'Group 3', description: 'Group three description' },
    ],
  },
  {
    id: '3',
    name: 'Charismatic',
    image: 'https://i.imgur.com/FKgciN1.png',
    groups: [
      { id: 'g7', name: 'Group 1', description: 'Group one description' },
      { id: 'g8', name: 'Group 2', description: 'Group two description' },
      { id: 'g9', name: 'Group 3', description: 'Group three description' },
    ],
  },
];

export default function CommunitiesList() {
  const router = useRouter();

  const renderGroup = ({ item }) => (
    <View style={styles.groupRow}>
      <View style={styles.groupIcon}>
        <Ionicons name="people-outline" size={20} color={ORANGE} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupDescription}>{item.description}</Text>
      </View>
    </View>
  );

  const renderCommunity = ({ item }) => (
    <View style={styles.communityContainer}>
      <Image source={{ uri: item.image }} style={styles.communityImage} />
      <Text style={styles.communityName}>{item.name}</Text>
      <FlatList
        data={item.groups}
        keyExtractor={(group) => group.id}
        renderItem={renderGroup}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ORANGE} />
        </TouchableOpacity>
        <Text style={styles.title}>Your Communities</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={communitiesData}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunity}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontWeight: '700',
    fontSize: 18,
    color: '#222',
    textAlign: 'center',
    flex: 1,
  },
  communityContainer: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: '#aaa',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f2f2f2',
  },
  communityImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: ORANGE,
    marginBottom: 10,
  },
  communityName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#222',
    marginBottom: 10,
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f1',
  },
  groupIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.3,
    borderColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  groupName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  groupDescription: {
    fontSize: 12,
    color: '#777',
  },
});
