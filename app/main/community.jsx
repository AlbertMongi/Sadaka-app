// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   FlatList,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   ActivityIndicator,
//   Platform,
//   Dimensions,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';

// const GOLD = '#FFA500';
// const FALLBACK_IMAGE =
//   'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=64&q=80';
// const { width } = Dimensions.get('window');

// export default function Community() {
//   const router = useRouter();
//   const scrollRef = useRef();
//   const [searchText, setSearchText] = useState('');
//   const [popularCommunities, setPopularCommunities] = useState([]);
//   const [allCommunities, setAllCommunities] = useState([]);
//   const [myCommunities, setMyCommunities] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('my');
//   const [error, setError] = useState(null);

//   const getHost = () =>
//     Platform.OS === 'android' ? 'http://192.168.100.24:8000' : 'http://192.168.100.24:8000';

//   useEffect(() => {
//     const fetchCommunities = async () => {
//       try {
//         setLoading(true);

//         // Fetch all communities
//         const allResponse = await fetch(`${getHost()}/api/communities`);
//         if (!allResponse.ok) {
//           console.error('All communities fetch failed:', allResponse.status, allResponse.statusText);
//           throw new Error(`All communities fetch failed: ${allResponse.status}`);
//         }
//         const allResult = await allResponse.json();
//         const allData = Array.isArray(allResult.data) ? allResult.data : [];

//         setPopularCommunities(
//           allData.slice(0, 6).map((c) => ({
//             id: c.id.toString(),
//             name: c.name,
//             description: c.description || 'No description available',
//             image: c.logo ? `${getHost()}/${c.logo}` : FALLBACK_IMAGE,
//           }))
//         );

//         setAllCommunities(
//           allData.map((c) => ({
//             id: c.id.toString(),
//             name: c.name,
//             description: c.description || 'No description available',
//             image: c.logo ? `${getHost()}/${c.logo}` : FALLBACK_IMAGE,
//           }))
//         );

//         // Fetch my communities
//         const myResponse = await fetch(`${getHost()}/api/communities/joined`);
//         if (!myResponse.ok) {
//           console.error('My communities fetch failed:', myResponse.status, myResponse.statusText);
//           setMyCommunities([]);
//         } else {
//           const myResult = await myResponse.json();
//           const myData = Array.isArray(myResult.data) ? myResult.data : [];
//           setMyCommunities(
//             myData.map((c) => ({
//               id: c.id.toString(),
//               name: c.name,
//               description: c.description || 'No description available',
//               image: c.logo ? `${getHost()}/${c.logo}` : FALLBACK_IMAGE,
//             }))
//           );
//         }

//         setError(null);
//       } catch (err) {
//         console.error('Fetch communities error:', err);
//         setError('Failed to load communities. Please try again.');
//         setPopularCommunities([]);
//         setAllCommunities([]);
//         setMyCommunities([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCommunities();
//   }, []);

//   const filteredMy = myCommunities.filter((c) =>
//     c.name.toLowerCase().includes(searchText.toLowerCase())
//   );
//   const filteredAll = allCommunities.filter((c) =>
//     c.name.toLowerCase().includes(searchText.toLowerCase())
//   );

//   const handleTabPress = (tab) => {
//     setActiveTab(tab);
//     scrollRef.current?.scrollTo({ x: tab === 'my' ? 0 : width, animated: true });
//   };

//   const handleScroll = (event) => {
//     const xOffset = event.nativeEvent.contentOffset.x;
//     setActiveTab(xOffset < width / 2 ? 'my' : 'all');
//   };

//   const renderCommunityItem = ({ item }) => (
//     <TouchableOpacity
//       style={styles.communityItem}
//       onPress={() => router.push({ pathname: '/CommunityDetail', params: { communityId: item.id } })}
//       activeOpacity={0.7}
//     >
//       <Image source={{ uri: item.image }} style={styles.communityImage} />
//       <View style={styles.communityDetails}>
//         <Text style={styles.communityTitle}>{item.name}</Text>
//         <Text style={styles.communityDescription}>{item.description}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <ActivityIndicator size="large" color={GOLD} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()}>
//           <Ionicons name="arrow-back-outline" size={26} color={GOLD} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Communities</Text>
//         <TouchableOpacity onPress={() => router.push('/notification')}>
//           <Ionicons name="notifications-outline" size={26} color={GOLD} />
//         </TouchableOpacity>
//       </View>

//       {/* Search */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search-outline" size={16} color="#888" style={styles.searchIcon} />
//         <TextInput
//           placeholder="Search for a community"
//           style={styles.searchInput}
//           value={searchText}
//           onChangeText={setSearchText}
//           autoCorrect={false}
//           autoCapitalize="none"
//           clearButtonMode="while-editing"
//         />
//         <TouchableOpacity onPress={() => router.push('JoinGroup')}>
//           <Ionicons name="add-circle-outline" size={24} color={GOLD} />
//         </TouchableOpacity>
//       </View>

//       {error && <Text style={styles.errorText}>{error}</Text>}

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//         {/* Popular Communities */}
//         <Text style={styles.sectionTitle}>Popular Communities</Text>
//         <FlatList
//           data={popularCommunities}
//           horizontal
//           keyExtractor={(item) => item.id}
//           showsHorizontalScrollIndicator={false}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               style={styles.popularItem}
//               onPress={() => router.push({ pathname: '/CommunityDetail', params: { communityId: item.id } })}
//               activeOpacity={0.7}
//             >
//               <Image source={{ uri: item.image }} style={styles.circularImage} />
//               <Text style={styles.popularText}>{item.name}</Text>
//             </TouchableOpacity>
//           )}
//           contentContainerStyle={styles.popularList}
//         />

//         {/* Tabs */}
//         <View style={styles.tabs}>
//           <TouchableOpacity onPress={() => handleTabPress('my')}>
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === 'my' ? styles.activeTab : styles.inactiveTab,
//               ]}
//             >
//               My Communities
//             </Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleTabPress('all')}>
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === 'all' ? styles.activeTab : styles.inactiveTab,
//               ]}
//             >
//               All Communities
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Horizontal Slider */}
//         <ScrollView
//           ref={scrollRef}
//           horizontal
//           pagingEnabled
//           showsHorizontalScrollIndicator={false}
//           onScroll={handleScroll}
//           scrollEventThrottle={16}
//         >
//           <View style={{ width }}>
//             <FlatList
//               data={filteredMy}
//               keyExtractor={(item) => item.id}
//               renderItem={renderCommunityItem}
//               contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
//               ListEmptyComponent={
//                 <Text style={styles.noCommunitiesText}>No communities found</Text>
//               }
//             />
//           </View>
//           <View style={{ width }}>
//             <FlatList
//               data={filteredAll}
//               keyExtractor={(item) => item.id}
//               renderItem={renderCommunityItem}
//               contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
//               ListEmptyComponent={
//                 <Text style={styles.noCommunitiesText}>No communities found</Text>
//               }
//             />
//           </View>
//         </ScrollView>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 50 },
//   center: { justifyContent: 'center', alignItems: 'center' },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 15,
//   },
//   headerTitle: { fontSize: 16, fontWeight: 'bold', color: '#000' },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F5F5F5',
//     borderRadius: 12,
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     marginBottom: 8,
//   },
//   searchIcon: { marginRight: 6 },
//   searchInput: { flex: 1, height: 30, fontSize: 14 },
//   scrollContent: { paddingBottom: 40 },
//   sectionTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginBottom: 8,
//     color: '#333',
//     marginTop: 10,
//   },
//   popularList: { paddingBottom: 10 },
//   popularItem: { marginRight: 12, alignItems: 'center', padding: 4 },
//   circularImage: {
//     width: 65,
//     height: 65,
//     borderRadius: 32.5,
//     borderWidth: 1,
//     borderColor: GOLD,
//   },
//   popularText: { fontSize: 11, textAlign: 'center', color: '#555', marginTop: 4 },
//   tabs: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginHorizontal: 16,
//   },
//   activeTab: {
//     color: GOLD,
//     borderBottomWidth: 2,
//     borderColor: GOLD,
//     paddingBottom: 4,
//   },
//   inactiveTab: {
//     color: '#888',
//     paddingBottom: 4,
//   },
//   communityItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 12,
//     marginRight: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   communityImage: {
//     width: 46,
//     height: 46,
//     borderRadius: 23,
//     borderWidth: 1,
//     borderColor: GOLD,
//     marginRight: 12,
//   },
//   communityDetails: { flex: 1 },
//   communityTitle: { fontSize: 13.5, fontWeight: 'bold', color: '#000' },
//   communityDescription: { fontSize: 12, color: '#555', marginTop: 2 },
//   noCommunitiesText: { textAlign: 'center', color: '#888', marginTop: 15, fontSize: 12 },
//   errorText: { textAlign: 'center', color: 'red', marginBottom: 10 },
// });


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

const GOLD = '#FFA500';
const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=64&q=80';
const { width } = Dimensions.get('window');

export default function Community() {
  const router = useRouter();
  const scrollRef = useRef();
  const [searchText, setSearchText] = useState('');
  const [popularCommunities, setPopularCommunities] = useState([]);
  const [allCommunities, setAllCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const getHost = () =>
    Platform.OS === 'android' ? 'http://192.168.100.24:8000' : 'http://192.168.100.24:8000';

  useEffect(() => {
    // Load token from AsyncStorage on mount
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        if (savedToken) {
          setToken(savedToken);
        } else {
          setError('User token not found. Please login again.');
        }
      } catch (e) {
        setError('Failed to load token. Please login again.');
      }
    };

    loadToken();
  }, []);

  useEffect(() => {
    if (!token) return; // Don't fetch communities if no token

    const fetchCommunities = async () => {
      try {
        setLoading(true);

        const headers = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Attach token here
        };

        // Fetch all communities
        const allResponse = await fetch(`${getHost()}/api/communities`, { headers });
        if (!allResponse.ok) {
          throw new Error(`All communities fetch failed: ${allResponse.status}`);
        }
        const allResult = await allResponse.json();
        const allData = Array.isArray(allResult.data) ? allResult.data : [];

        setPopularCommunities(
          allData.slice(0, 6).map((c) => ({
            id: c.id.toString(),
            name: c.name,
            description: c.description || 'No description available',
            image: c.logo ? `${getHost()}/${c.logo}` : FALLBACK_IMAGE,
          }))
        );

        setAllCommunities(
          allData.map((c) => ({
            id: c.id.toString(),
            name: c.name,
            description: c.description || 'No description available',
            image: c.logo ? `${getHost()}/${c.logo}` : FALLBACK_IMAGE,
          }))
        );

        // Fetch my communities
        const myResponse = await fetch(`${getHost()}/api/communities/joined`, { headers });
        if (!myResponse.ok) {
          setMyCommunities([]);
        } else {
          const myResult = await myResponse.json();
          const myData = Array.isArray(myResult.data) ? myResult.data : [];
          setMyCommunities(
            myData.map((c) => ({
              id: c.id.toString(),
              name: c.name,
              description: c.description || 'No description available',
              image: c.logo ? `${getHost()}/${c.logo}` : FALLBACK_IMAGE,
            }))
          );
        }

        setError(null);
      } catch (err) {
        console.error('Fetch communities error:', err);
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
      onPress={() => router.push({ pathname: '/CommunityDetail', params: { communityId: item.id } })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.communityImage} />
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
          clearButtonMode="while-editing"
        />
        <TouchableOpacity onPress={() => router.push('JoinGroup')}>
          <Ionicons name="add-circle-outline" size={24} color={GOLD} />
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Popular Communities */}
        <Text style={styles.sectionTitle}>Popular Communities</Text>
        <FlatList
          data={popularCommunities}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.popularItem}
              onPress={() => router.push({ pathname: '/CommunityDetail', params: { communityId: item.id } })}
              activeOpacity={0.7}
            >
              <Image source={{ uri: item.image }} style={styles.circularImage} />
              <Text style={styles.popularText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.popularList}
        />

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => handleTabPress('my')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'my' ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              My Communities
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleTabPress('all')}>
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' ? styles.activeTab : styles.inactiveTab,
              ]}
            >
              All Communities
            </Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Slider */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
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
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 50 },
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
    backgroundColor: '#F5F5F5',
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
    color: '#333',
    marginTop: 10,
  },
  popularList: { paddingBottom: 10 },
  popularItem: { marginRight: 12, alignItems: 'center', padding: 4 },
  circularImage: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
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
    fontSize: 14,
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
