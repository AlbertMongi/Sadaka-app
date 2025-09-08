import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '../apiConfig'; // ✅ Correct path

import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const { width, height } = Dimensions.get('window');
const GOLD = '#FFA500';
const FALLBACK_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s';

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [scripture, setScripture] = useState(null);
  const [sermons, setSermons] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingScripture, setLoadingScripture] = useState(true);
  const [loadingSermons, setLoadingSermons] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [joinedCommunities, setJoinedCommunities] = useState([]);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  

  const labels = {
    en: {  sermons: 'Sermons', events: 'Upcoming Events' },
    sw: {  sermons: 'Mahubiri', events: 'Matukio Yanayokuja' },
  };

  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'sw' : 'en'));

  async function fetchWithToken(url) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      return json;
    } catch (error) {
      console.error('Fetch error:', error);
      return null;
    }
  }


const fetchJoinedCommunities = async () => {
  setLoadingCommunities(true);
  try {
    const res = await fetchWithToken(`${BASE_URL}/communities/joined`);

    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      setJoinedCommunities(res.data);

      const savedCommunityId = await AsyncStorage.getItem('selectedCommunityId');
      const matchedCommunity = savedCommunityId
        ? res.data.find((c) => c.id.toString() === savedCommunityId)
        : null;

      if (matchedCommunity) {
        setSelectedCommunityId(parseInt(savedCommunityId, 10));
      } else {
        setSelectedCommunityId(null);
        await AsyncStorage.removeItem('selectedCommunityId');
      }
    } else {
      // No communities joined
      setJoinedCommunities([]);
      setSelectedCommunityId(null);
      await AsyncStorage.removeItem('selectedCommunityId');
    }
  } catch (error) {
    console.error('Error fetching joined communities:', error);
    setSelectedCommunityId(null);
  } finally {
    setLoadingCommunities(false);
  }
};

const fetchData = async () => {
  // User Profile (always fetch)
  setLoadingUser(true);
  const userRes = await fetchWithToken(`${BASE_URL}/user/profile`);
  if (userRes?.success && userRes.data) {
    setUser(userRes.data);
  }
  setLoadingUser(false);

  // Scripture - allow general fetch if no community selected
  setLoadingScripture(true);
  try {
    const scriptureUrl = selectedCommunityId
      ? `${BASE_URL}/scriptures/user/${selectedCommunityId}`
      : `${BASE_URL}/scriptures/user/`;

    const scriptureRes = await fetchWithToken(scriptureUrl);

    if (scriptureRes?.success && scriptureRes.data?.length) {
      const apiScripture = scriptureRes.data[0];
      const scriptureData = {
        label: "Verse of the Day",
        verse_reference: apiScripture.name,
        verse_text: apiScripture.description,
        imageUrl: apiScripture.photo || FALLBACK_IMAGE,
      };
      setScripture(scriptureData);
    } else {
      setScripture(null);
    }
  } catch (error) {
    console.error('Failed to fetch scripture:', error);
    setScripture(null);
  } finally {
    setLoadingScripture(false);
  }

  // Sermons - allow general fetch if no community selected
  setLoadingSermons(true);
  const sermonsUrl = selectedCommunityId
    ? `${BASE_URL}/sermons/user/${selectedCommunityId}`
    : `${BASE_URL}/sermons/user/`;

  const sermonsRes = await fetchWithToken(sermonsUrl);
  if (sermonsRes?.success && Array.isArray(sermonsRes.data)) {
    setSermons(
      sermonsRes.data.map((sermon) => ({
        id: sermon.id,
        title: sermon.name,
        imageUrl: sermon.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s',
      }))
    );
  } else {
    setSermons([]);
  }
  setLoadingSermons(false);

  // Events - only fetch if community is selected
  setLoadingEvents(true);
  if (selectedCommunityId) {
    const eventsRes = await fetchWithToken(
      `http://192.168.100.24:8000/api/events/upcoming/${selectedCommunityId}`
    );
    if (eventsRes?.success && Array.isArray(eventsRes.data)) {
      setEvents(
        eventsRes.data.map((event) => ({
          ...event,
          imageUrl: event.imageUrl || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s',
        }))
      );
    } else {
      setEvents([]);
    }
  } else {
    console.warn("No community selected. Skipping upcoming events fetch.");
    setEvents([]); // Or keep previous events
  }
  setLoadingEvents(false);
};

// Use effects
useEffect(() => {
  fetchJoinedCommunities();
}, []);

useEffect(() => {
  fetchData(); // Always run fetchData, even if no community is selected
}, [selectedCommunityId]);

const onSelectCommunity = async (communityId) => {
  setDropdownVisible(false);
  if (communityId !== selectedCommunityId) {
    setSelectedCommunityId(communityId);
    await AsyncStorage.setItem('selectedCommunityId', communityId.toString());
  }
};


  const getGreeting = () => {
    const hour = new Date().getHours();
    const firstName = user?.firstName || user?.name?.split(' ')[0] || '';

    if (language === 'sw') {
      if (hour < 12) return `HABARI ZA ASUBUHI${firstName ? ', ' + firstName.toUpperCase() : ''}`;
      if (hour < 18) return `HABARI ZA MCHANA${firstName ? ', ' + firstName.toUpperCase() : ''}`;
      return `HABARI ZA JIONI${firstName ? ', ' + firstName.toUpperCase() : ''}`;
    } else {
      if (hour < 12) return `GOOD MORNING${firstName ? ', ' + firstName : ''}`;
      if (hour < 18) return `GOOD AFTERNOON${firstName ? ', ' + firstName : ''}`;
      return `GOOD EVENING${firstName ? ', ' + firstName : ''}`;
    }
  };

  const CommunityDropdown = () => (
    <>
      <TouchableOpacity
        onPress={() => setDropdownVisible(!dropdownVisible)}
        style={styles.dropdownToggle}
      >
        <Text style={styles.dropdownText}>
          {joinedCommunities.find((c) => c.id === selectedCommunityId)?.name || 'Select Community'}
        </Text>
        <Ionicons
          name={dropdownVisible ? 'chevron-up-outline' : 'chevron-down-outline'}
          size={18}
          color={GOLD}
        />
      </TouchableOpacity>

      <Modal
        transparent
        visible={dropdownVisible}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setDropdownVisible(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.dropdownListContainer}>
          <FlatList
            data={joinedCommunities}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.dropdownItem,
                  item.id === selectedCommunityId && styles.dropdownItemSelected,
                ]}
                onPress={() => onSelectCommunity(item.id)}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    item.id === selectedCommunityId && styles.dropdownItemTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, minHeight: height }}
        ref={scrollRef}
      >
        {/* Header */}
        <View style={styles.customHeader}>
          <View style={styles.navBar}>
            <View style={styles.tabs}>
              <Text style={[styles.tabText, styles.tabActive]}>{labels[language].today}</Text>
              <View style={styles.profileDropdownContainer}>
                <MaterialCommunityIcons name="church" size={24} color={GOLD} />
                {!loadingCommunities && joinedCommunities.length > 0 && <CommunityDropdown />}
                {loadingCommunities && <ActivityIndicator size="small" color={GOLD} />}
              </View>
            </View>
            <View style={styles.icons}>
              <TouchableOpacity onPress={toggleLanguage} style={styles.iconTouchable}>
                <Ionicons name="globe-outline" size={20} color={GOLD} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push('/notification')}
                style={styles.iconTouchable}
              >
                <Ionicons name="notifications-outline" size={20} color={GOLD} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.greetingRow}>
            <Ionicons name="sunny-outline" size={16} color="#888" />
            <Text style={styles.greetingText}> {getGreeting()}</Text>
          </View>
        </View>

        {/* Scripture of the Day */}
        <View style={styles.section}>
          {loadingScripture ? (
            <ActivityIndicator color={GOLD} style={{ marginTop: 16 }} />
          ) : scripture ? (
            <View style={styles.wordCard}>
              <Image
                source={{ uri: scripture.imageUrl }}
                style={styles.wordImage}
                resizeMode="cover"
                onError={(e) => console.log('Scripture image error:', e.nativeEvent.error)}
              />
              <View style={styles.wordOverlay} />
              <View style={styles.wordContent}>
                <Text style={styles.verseRef}>{scripture.verse_reference}</Text>
                <Text style={styles.verseText}>{scripture.verse_text}</Text>
              </View>
            </View>
          ) : (
            <Text style={{ paddingHorizontal: 16, color: '#666' }}>
              {language === 'sw' ? 'Hakuna maandiko yanayopatikana.' : 'No scripture found.'}
            </Text>
          )}
        </View>

        {/* Sermons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels[language].sermons}</Text>
          {loadingSermons ? (
            <ActivityIndicator color={GOLD} style={{ marginTop: 8 }} />
          ) : sermons.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, marginTop: 8 }}
            >
              {/* {sermons.map((sermon) => (
                <View key={sermon.id} style={styles.sermonCard}>
                  <Image
                    source={{ uri: sermon.imageUrl }}
                    style={styles.sermonImage}
                    resizeMode="cover"
                    onError={(e) => console.log(`Sermon image error (${sermon.title}):`, e.nativeEvent.error)}
                  />
                  <View style={styles.sermonOverlay}>
                    <Text style={styles.sermonTitle}>{sermon.title}</Text>
                    <Text style={styles.sermonDescription} numberOfLines={2}>
                      {sermon.description}
                    </Text>
                  </View>
                </View>
              ))} */}
              {sermons.map((sermon) => (
  <TouchableOpacity
    key={sermon.id}
    style={styles.sermonCard}
    activeOpacity={0.8}
    onPress={() =>
      router.push({
        pathname: '/sermon',
        params: { id: sermon.id }, // Pass sermon ID to detail page
      })
    }
  >
    <Image
      source={{ uri: sermon.imageUrl }}
      style={styles.sermonImage}
      resizeMode="cover"
      onError={(e) => console.log(`Sermon image error (${sermon.title}):`, e.nativeEvent.error)}
    />
    <View style={styles.sermonOverlay}>
      <Text style={styles.sermonTitle}>{sermon.title}</Text>
      <Text style={styles.sermonDescription} numberOfLines={2}>
        
      </Text>
    </View>
  </TouchableOpacity>
))}

            </ScrollView>
          ) : (
            <Text style={{ paddingHorizontal: 16, color: '#666' }}>
              {language === 'sw' ? 'Hakuna mahubiri yanayopatikana.' : 'No sermons found.'}
            </Text>
          )}
        </View>

        {/* Upcoming Events */}
        <View style={[styles.section, { paddingBottom: 20, backgroundColor: '#fff' }]}>
          <Text style={styles.sectionTitle}>{labels[language].events}</Text>
          {loadingEvents ? (
            <ActivityIndicator color={GOLD} style={{ marginTop: 8 }} />
          ) : events.length > 0 ? (
            <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
              {events.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCardVertical}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname: '/EventDetailScreen',
                      params: { id: event.id },
                    })
                  }
                >
                  <Image
                    source={{ uri: event.imageUrl }}
                    style={styles.eventImageVertical}
                    resizeMode="cover"
                    onError={(e) => console.log(`Event image error (${event.name || 'Unnamed'}):`, e.nativeEvent.error)}
                  />
                  <View style={styles.eventInfoVertical}>
                    <Text style={styles.eventName}>{event.name || 'Unnamed Event'}</Text>
                    <Text style={styles.eventTime}>
  {event.eventDate
    ? new Date(event.eventDate).toLocaleString(undefined, {
        weekday: 'short', // e.g. "Mon"
        month: 'short',   // e.g. "Sep"
        day: 'numeric',   // e.g. 1
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,     // For 12-hour format like "10:30 AM"
      })
    : 'Time not specified'}
</Text>

                    <Text style={styles.eventLocation}>
                      {[
                        event.street,
                        event.district,
                        event.region,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'No location'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={{ paddingHorizontal: 16, color: '#666' }}>
              {language === 'sw' ? 'Hakuna matukio yanayopatikana.' : 'No events found.'}
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 10 },
  customHeader: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? -100 : 50,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabs: { flexDirection: 'row', alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: 'bold', marginRight: 4 },
  tabActive: { color: GOLD },
  icons: { flexDirection: 'row', alignItems: 'center' },
  iconTouchable: { marginRight: 12, padding: 4, borderRadius: 6 },
  greetingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  greetingText: { fontSize: 12, color: '#777', fontWeight: '600', marginLeft: 6 },
  profileDropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: GOLD,
    borderRadius: 6,
  },
  dropdownText: {
    fontSize: 12,
    color: GOLD,
    marginRight: 4,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  dropdownListContainer: {
    position: 'absolute',
    top: 70,
    right: 16,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemSelected: {
    backgroundColor: GOLD,
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#222',
  },
  dropdownItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    paddingHorizontal: 16,
  },
  wordCard: {
    width: width - 32,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    position: 'relative', // Ensure positioning context for children
  },
  wordImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  wordOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
  },
  wordContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    position: 'relative', // Ensure content is above image and overlay
  },
  verseRef: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  verseText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 18,
  },
  sermonCard: {
    width: 110,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#000',
  },
  sermonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sermonOverlay: {
    flex: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
sermonTitle: {
  color: '#fff',
  fontSize: 11,
  fontWeight: '600',
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto',
  display: 'block', // if it's an inline element like <span>
},

  sermonDescription: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '400',
    marginTop: 2,
  },
  eventCardVertical: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  eventImageVertical: {
    width: 110,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
    // borderWidth: 1,
    // borderColor: GOLD,
  },
  eventInfoVertical: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  eventName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
  },
  eventTime: {
    fontSize: 12,
    fontWeight: '600',
    color: GOLD,
    marginTop: 2,
  },
  eventLocation: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});