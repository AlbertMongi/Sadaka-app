import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../apiConfig'; // ✅ Correct path

const GOLD = '#FFA500';
const FALLBACK_IMAGE =
  'https://m.media-amazon.com/images/I/816Etq5qEwL._AC_SL1500_.jpg';
const { width } = Dimensions.get('window');

export default function Community() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

const getHost = () => BASE_URL;


  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        if (savedToken) {
          setToken(savedToken);
        } else {
          setError('User token not found. Please login again.');
          router.replace('/login');
        }
      } catch (e) {
        setError('Failed to load token. Please login again.');
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchCommunities = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        };

        // Fetch all communities
        const allResponse = await fetch(`${getHost()}/communities`, { headers });
        if (!allResponse.ok) throw new Error('Failed to fetch all communities');
        const allResult = await allResponse.json();
        const allData = Array.isArray(allResult.data) ? allResult.data : [];

        const formattedAll = allData.map((c) => ({
          id: c.id.toString(),
          name: c.name,
          description: c.description || 'No description available',
          image: c.logo || FALLBACK_IMAGE,
        }));

        setPopularCommunities(formattedAll.slice(0, 6));
        setAllCommunities(formattedAll);

        // Fetch joined communities
        const myResponse = await fetch(`${getHost()}/communities/joined`, { headers });
        const myResult = await myResponse.json();
        const myData = Array.isArray(myResult.data) ? myResult.data : [];

        const formattedMy = myData.map((c) => ({
          id: c.id.toString(),
          name: c.name,
          description: c.description || 'No description available',
          image: c.logo || FALLBACK_IMAGE,
        }));

        setMyCommunities(formattedMy);
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities. Please try again.');
        setPopularCommunities([]);
        setAllCommunities([]);
        setMyCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [token]);

  const filteredMy = myCommunities.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredAll = allCommunities.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    scrollRef.current?.scrollTo({ x: tab === 'my' ? 0 : width, animated: true });
  };

  const handleScroll = (event) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    setActiveTab(xOffset < width / 2 ? 'my' : 'all');
  };

  const renderCommunityItem = ({ item }) => (
    <TouchableOpacity
      style={styles.communityItem}
      activeOpacity={0.7}
      onPress={() =>
        router.push({ pathname: '/CommunityDetail', params: { communityId: item.id } })
      }
    >
      <Image source={{ uri: item.image }} style={styles.communityImage} resizeMode="cover" />
      <View style={styles.communityDetails}>
        <Text style={styles.communityTitle}>{item.name}</Text>
        <Text style={styles.communityDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={GOLD} />
      </View>
    );
  }

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

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color="#888" style={styles.searchIcon} />
        <TextInput
          placeholder="Search for a community"
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Popular Communities</Text>
        <FlatList
          data={popularCommunities}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.popularList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.popularItem}
              activeOpacity={0.7}
              onPress={() =>
                router.push({ pathname: '/CommunityDetail', params: { communityId: item.id } })
              }
            >
              <Image
                source={{ uri: item.image }}
                style={styles.circularImage}
                resizeMode="cover"
              />
              <Text style={styles.popularText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => handleTabPress('my')}>
            <Text
              style={[styles.tabText, activeTab === 'my' ? styles.activeTab : styles.inactiveTab]}
            >
              My Communities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabPress('all')}>
            <Text
              style={[styles.tabText, activeTab === 'all' ? styles.activeTab : styles.inactiveTab]}
            >
              All Communities
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* My Communities */}
          <View style={{ width }}>
            <FlatList
              data={filteredMy}
              keyExtractor={(item) => item.id}
              renderItem={renderCommunityItem}
              contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
              ListEmptyComponent={
                <Text style={styles.noCommunitiesText}>No communities found</Text>
              }
            />
          </View>

          {/* All Communities */}
          <View style={{ width }}>
            <FlatList
              data={filteredAll}
              keyExtractor={(item) => item.id}
              renderItem={renderCommunityItem}
              contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
              ListEmptyComponent={
                <Text style={styles.noCommunitiesText}>No communities found</Text>
              }
            />
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 20 },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5ff',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  searchIcon: { marginRight: 6 },
  searchInput: { flex: 1, height: 30, fontSize: 14 },
  scrollContent: { paddingBottom: 40 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333ff',
    marginTop: 10,
  },
  popularList: { paddingBottom: 10 },
  popularItem: { marginRight: 12, alignItems: 'center', padding: 4 },
  circularImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: GOLD,
  },
  popularText: { fontSize: 11, textAlign: 'center', color: '#555', marginTop: 4 },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  activeTab: {
    color: GOLD,
    borderBottomWidth: 2,
    borderColor: GOLD,
    paddingBottom: 4,
  },
  inactiveTab: {
    color: '#888',
    paddingBottom: 4,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  communityImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: GOLD,
    marginRight: 12,
  },
  communityDetails: { flex: 1 },
  communityTitle: { fontSize: 13.5, fontWeight: 'bold', color: '#000' },
  communityDescription: { fontSize: 12, color: '#555', marginTop: 2 },
  noCommunitiesText: { textAlign: 'center', color: '#888', marginTop: 15, fontSize: 12 },
  errorText: { textAlign: 'center', color: 'red', marginBottom: 10 },
});
