
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../apiConfig';

const GOLD = '#FFA500';
const FALLBACK_IMAGE =
  'https://m.media-amazon.com/images/I/816Etq5qEwL._AC_SL1500_.jpg';
const { width } = Dimensions.get('window');

export default function Community() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  // Animation states
  const popularAnims = useRef([]);
  const communityAnims = useRef([]);

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
        popularAnims.current = formattedAll.slice(0, 6).map(() => ({
          fade: new Animated.Value(0),
          slide: new Animated.Value(30),
        }));
        communityAnims.current = formattedAll.map(() => ({
          fade: new Animated.Value(0),
          slide: new Animated.Value(30),
        }));

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
        if (activeTab === 'my') {
          communityAnims.current = formattedMy.map(() => ({
            fade: new Animated.Value(0),
            slide: new Animated.Value(30),
          }));
        }

        // Animate sections
        animateSections();
      } catch (err) {
        console.error('Error fetching communities:', err);
        setError('Failed to load communities. Please try again.');
        setPopularCommunities([]);
        setAllCommunities([]);
        setMyCommunities([]);
        popularAnims.current = [];
        communityAnims.current = [];
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [token]);

  useEffect(() => {
    // Update animations when activeTab changes
    if (activeTab === 'my') {
      communityAnims.current = myCommunities.map(() => ({
        fade: new Animated.Value(0),
        slide: new Animated.Value(30),
      }));
    } else {
      communityAnims.current = allCommunities.map(() => ({
        fade: new Animated.Value(0),
        slide: new Animated.Value(30),
      }));
    }
    animateSections();
  }, [activeTab, myCommunities, allCommunities]);

  const animateSections = () => {
    const animations = [];

    // Animate popular communities
    popularAnims.current.forEach((anim, index) => {
      animations.push(
        Animated.sequence([
          Animated.delay(index * 100),
          Animated.parallel([
            Animated.timing(anim.fade, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(anim.slide, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    // Animate main communities (my or all)
    communityAnims.current.forEach((anim, index) => {
      animations.push(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.parallel([
            Animated.timing(anim.fade, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(anim.slide, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    });

    Animated.parallel(animations).start();
  };

  const filteredMy = myCommunities.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const filteredAll = allCommunities.filter((c) =>
    c.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const renderCommunityItem = ({ item, index }) => (
    <Animated.View
      style={{
        opacity: communityAnims.current[index]?.fade || 0,
        transform: [{ translateY: communityAnims.current[index]?.slide || 30 }],
      }}
    >
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
    </Animated.View>
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
          <Ionicons  />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Communities</Text>
        <TouchableOpacity onPress={() => router.push('/notification')}>
          <Ionicons  />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={16} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Main vertical FlatList */}
      <FlatList
        data={activeTab === 'my' ? filteredMy : filteredAll}
        keyExtractor={(item) => item.id}
        renderItem={renderCommunityItem}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        ListEmptyComponent={
          <Text style={styles.noCommunitiesText}>No communities found</Text>
        }
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Popular Communities</Text>
            <FlatList
              data={popularCommunities}
              horizontal
              keyExtractor={(item) => item.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularList}
              renderItem={({ item, index }) => (
                <Animated.View
                  style={{
                    opacity: popularAnims.current[index]?.fade || 0,
                    transform: [{ translateY: popularAnims.current[index]?.slide || 30 }],
                  }}
                >
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
                </Animated.View>
              )}
            />

            {/* Tabs */}
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
          </>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 20, // increased from 16
    paddingTop: Platform.OS === 'ios' ? -30 : 40, // slightly more top padding
  },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20, // increased spacing
  },
  headerTitle: { 
    fontSize: 18, // increased
    color: '#000', 
    fontFamily: 'GothamBold' 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 20, // slightly more rounded
    paddingHorizontal: 14, // increased
    paddingVertical: 6, // increased
    borderWidth: 1,
    borderColor: GOLD,
    marginBottom: 14, // increased
    height: 36, // increased from 36
  },
  searchIcon: { marginRight: 10 }, // slightly more spacing
  searchInput: { 
    flex: 1, 
    height: 34, // slightly taller
    fontSize: 15, // slightly larger
    fontFamily: 'GothamRegular' 
  },
  sectionTitle: {
    fontSize: 15, // increased
    marginBottom: 10, // slightly more spacing
    color: '#333333ff',
    marginTop: 12, // increased
    fontFamily: 'GothamBold',
  },
  popularList: { paddingBottom: 14 }, // increased
  popularItem: { marginRight: 14, alignItems: 'center', padding: 6 }, // slightly bigger
  circularImage: {
    width: 56, // increased
    height: 56, // increased
    borderRadius: 28,
    borderWidth: 1,
    borderColor: GOLD,
  },
  popularText: { 
    fontSize: 12, // slightly larger
    textAlign: 'center', 
    color: '#000000', 
    marginTop: 6, // slightly larger spacing
    fontFamily: 'GothamMedium',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12, // slightly larger
  },
  tabText: {
    fontSize: 14, // slightly larger
    marginHorizontal: 18,
    fontFamily: 'GothamMedium',
  },
  activeTab: {
    color: GOLD,
    borderBottomWidth: 2,
    borderColor: GOLD,
    paddingBottom: 5,
    fontFamily: 'GothamMedium',
  },
  inactiveTab: {
    color: '#000000',
    paddingBottom: 5,
    fontFamily: 'GothamMedium',
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12, // slightly larger
    paddingHorizontal: 14, // increased
    paddingVertical: 10, // increased
    marginBottom: 14, // slightly increased
    marginRight: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  communityImage: {
    width: 50, // increased
    height: 50, // increased
    borderRadius: 25,
    borderWidth: 1,
    borderColor: GOLD,
    marginRight: 14,
  },
  communityDetails: { flex: 1 },
  communityTitle: { 
    fontSize: 14, // increased
    color: '#000', 
    fontFamily: 'GothamBold' 
  },
  communityDescription: { 
    fontSize: 13, // slightly larger
    color: '#555', 
    marginTop: 3, 
    fontFamily: 'GothamRegular' 
  },
  noCommunitiesText: { 
    textAlign: 'center', 
    color: '#888', 
    marginTop: 18, // slightly more spacing
    fontSize: 13, // slightly larger
    fontFamily: 'GothamRegular',
  },
  errorText: { 
    textAlign: 'center', 
    color: 'red', 
    marginBottom: 12, // slightly more spacing
    fontFamily: 'GothamRegular',
  },
});
