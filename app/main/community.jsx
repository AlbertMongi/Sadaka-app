import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const GOLD = '#FFA500';
const screenWidth = Dimensions.get('window').width;

const popularCommunities = [
  { id: '1', name: 'Man of Victory', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' },
  { id: '2', name: 'Charismatic', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' },
  { id: '3', name: 'Women of Grace', image: 'https://cdn.pixabay.com/photo/2016/03/31/14/43/teddy-bear-1292199_1280.jpg' },
  { id: '4', name: 'The Bridge', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' },
];

const allCommunities = [
  { id: '1', name: 'Open door greeters', description: 'Making newcomers feel welcome and integrated.' },
  { id: '2', name: 'Young Vine Disciples', description: 'Nurturing the growth of young adults in their faith.' },
  { id: '3', name: 'Crossroads Crusaders', description: 'Finding faith and fellowship through sports and recreation.' },
  { id: '4', name: 'Silver Saints', description: 'A vibrant group for active seniors to connect and grow.' },
  { id: '5', name: 'The Cornerstone Fellowship', description: 'Fellowship and spiritual growth for all ages.' },
];

export default function Community() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  const filteredCommunities = allCommunities.filter((community) =>
    community.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={26} color={GOLD} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Communities</Text>
        <TouchableOpacity onPress={() => router.push('/notification')}>
          <Ionicons name="notifications-outline" size={26} color={GOLD} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search for a community"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        <TouchableOpacity onPress={() => router.push('JoinGroup')}>
          <Ionicons name="add-circle-outline" size={24} color={GOLD} />
        </TouchableOpacity>
      </View>

      {/* Create Community Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('CreateCommunity')}
      >
        <Text style={styles.createButtonText}>Create Community</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Popular Communities */}
        <Text style={styles.sectionTitle}>Popular communities</Text>
        <FlatList
          data={popularCommunities}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.popularItem}
              onPress={() => router.push('/description')}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.image }}
                style={styles.circularImage}
                onError={(e) => console.log('Image failed to load', e.nativeEvent.error)}
              />
              <Text style={styles.popularText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.popularList}
        />

        {/* All Communities */}
        <Text style={styles.sectionTitle}>All communities</Text>
        {filteredCommunities.length === 0 ? (
          <Text style={styles.noCommunitiesText}>No communities found</Text>
        ) : (
          filteredCommunities.map((community) => (
            <TouchableOpacity
              key={community.id}
              style={styles.allItem}
              onPress={() => router.push('/description')}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
                style={styles.smallCircularImage}
              />
              <View style={styles.communityDetails}>
                <Text style={styles.allTitle}>{community.name}</Text>
                <Text style={styles.allDesc}>{community.description}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 30,
    fontSize: 13,
  },
  createButton: {
    backgroundColor: GOLD,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 4,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 70,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  popularList: {
    paddingHorizontal: 0,
    paddingBottom: 10,
  },
  popularItem: {
    marginRight: 12,
    alignItems: 'center',
    padding: 4,
  },
  circularImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    borderWidth: 1,
    borderColor: GOLD,
  },
  popularText: {
    fontSize: 10,
    textAlign: 'center',
    color: '#555',
    marginTop: 4,
  },
  allItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  smallCircularImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: GOLD,
    marginRight: 10,
  },
  communityDetails: {
    flex: 1,
  },
  allTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  allDesc: {
    fontSize: 10,
    color: '#555',
  },
  noCommunitiesText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 15,
    fontSize: 11,
  },
});
