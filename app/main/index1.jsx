
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Animated, ActivityIndicator, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, FlatList, TouchableWithoutFeedback, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../apiConfig';

const { width, height } = Dimensions.get('window');
const GOLD = '#E18731';
const FALLBACK_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb_oySS2-AZYC97VkAwMB1NKY1Wm1qHy_CeQ&s';

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const initialCommunityIdRef = useRef(null);

  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null);
  const [scriptures, setScriptures] = useState([]);
  const [currentScriptureIndex, setCurrentScriptureIndex] = useState(0);
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
  const [likes, setLikes] = useState({});

  // Animation states
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scriptureAnims = useRef([]);
  const sermonAnims = useRef([]);
  const eventAnims = useRef([]);

  const labels = {
    en: { sermons: 'Sermons', events: 'Upcoming Events' },
    sw: { sermons: 'Mahubiri', events: 'Matukio Yanayokuja' },
  };

  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'sw' : 'en'));

  async function fetchWithToken(url, options = {}) {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No token found');

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
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

  const getCacheKey = (type) => `home_${type}_${selectedCommunityId || 'general'}`;

  const loadCachedData = async () => {
    try {
      const cachedScriptures = await AsyncStorage.getItem(getCacheKey('scriptures'));
      if (cachedScriptures) {
        const parsedScriptures = JSON.parse(cachedScriptures);
        setScriptures(parsedScriptures);
        setCurrentScriptureIndex(0);
        scriptureAnims.current = parsedScriptures.map(() => ({
          fade: new Animated.Value(0),
          scale: new Animated.Value(0.8),
        }));
      }

      const cachedSermons = await AsyncStorage.getItem(getCacheKey('sermons'));
      if (cachedSermons) {
        const parsedSermons = JSON.parse(cachedSermons);
        setSermons(parsedSermons);
        sermonAnims.current = parsedSermons.map(() => ({
          fade: new Animated.Value(0),
          slide: new Animated.Value(30),
        }));
      }

      const cachedEvents = await AsyncStorage.getItem(getCacheKey('events'));
      if (cachedEvents) {
        const parsedEvents = JSON.parse(cachedEvents);
        setEvents(parsedEvents);
        eventAnims.current = parsedEvents.map(() => ({
          fade: new Animated.Value(0),
          slide: new Animated.Value(30),
        }));
      }

      return !!(cachedScriptures && cachedSermons && cachedEvents);
    } catch (error) {
      console.error('Error loading cached data:', error);
      return false;
    }
  };

  const cacheData = async () => {
    try {
      if (scriptures.length > 0) await AsyncStorage.setItem(getCacheKey('scriptures'), JSON.stringify(scriptures));
      if (sermons.length > 0) await AsyncStorage.setItem(getCacheKey('sermons'), JSON.stringify(sermons));
      if (events.length > 0) await AsyncStorage.setItem(getCacheKey('events'), JSON.stringify(events));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  const fetchJoinedCommunities = async () => {
    setLoadingCommunities(true);
    try {
      const res = await fetchWithToken(`${BASE_URL}/communities/joined`);

      if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
        setJoinedCommunities(res.data);
        setSelectedCommunityId(null);
        initialCommunityIdRef.current = null;
        await AsyncStorage.removeItem('selectedCommunityId');
      } else {
        setJoinedCommunities([]);
        setSelectedCommunityId(null);
        initialCommunityIdRef.current = null;
        await AsyncStorage.removeItem('selectedCommunityId');
      }
    } catch (error) {
      console.error('Error fetching joined communities:', error);
      setSelectedCommunityId(null);
      initialCommunityIdRef.current = null;
      await AsyncStorage.removeItem('selectedCommunityId');
    } finally {
      setLoadingCommunities(false);
    }
  };

  const fetchData = async (forceFetch = false) => {
    if (!forceFetch) {
      const hasCache = await loadCachedData();
      if (hasCache && initialCommunityIdRef.current === selectedCommunityId) {
        setLoadingScripture(false);
        setLoadingSermons(false);
        setLoadingEvents(false);
        animateSections();
        return;
      }
    }

    setLoadingUser(true);
    const userRes = await fetchWithToken(`${BASE_URL}/user/profile`);
    if (userRes?.success && userRes.data) {
      setUser(userRes.data);
    }
    setLoadingUser(false);
if (!selectedCommunityId) {
  console.warn('selectedCommunityId is required to fetch scriptures and sermons.');
  return;
}

setLoadingScripture(true);
try {
  const scriptureUrl = `${BASE_URL}/scriptures/user/${selectedCommunityId}`;
  const scriptureRes = await fetchWithToken(scriptureUrl);

  if (scriptureRes?.success && scriptureRes.data?.length) {
    const scriptureData = scriptureRes.data.map((apiScripture) => ({
      id: apiScripture.id,
      label: "Verse of the Day",
      verse_reference: apiScripture.name,
      verse_text: apiScripture.description,
      imageUrl: apiScripture.photo || FALLBACK_IMAGE,
      like_count: apiScripture.like_count || 0,
    }));
    setScriptures(scriptureData);

    const initialLikes = {};
    scriptureData.forEach((scripture) => {
      initialLikes[scripture.id] = scripture.like_count;
    });
    setLikes(initialLikes);

    scriptureAnims.current = scriptureData.map(() => ({
      fade: new Animated.Value(0),
      scale: new Animated.Value(0.8),
    }));
    setCurrentScriptureIndex(0);
  } else {
    setScriptures([]);
    scriptureAnims.current = [];
  }
} catch (error) {
  console.error('Failed to fetch scriptures:', error);
  setScriptures([]);
  scriptureAnims.current = [];
} finally {
  setLoadingScripture(false);
}

setLoadingSermons(true);
try {
  const sermonsUrl = `${BASE_URL}/sermons/user/${selectedCommunityId}`;
  const sermonsRes = await fetchWithToken(sermonsUrl);

  if (sermonsRes?.success && Array.isArray(sermonsRes.data)) {
    const sermonData = sermonsRes.data.map((sermon) => ({
      id: sermon.id,
      title: sermon.name,
      imageUrl: sermon.photo || FALLBACK_IMAGE,
    }));
    setSermons(sermonData);
    sermonAnims.current = sermonData.map(() => ({
      fade: new Animated.Value(0),
      slide: new Animated.Value(30),
    }));
  } else {
    setSermons([]);
    sermonAnims.current = [];
  }
} catch (error) {
  console.error('Failed to fetch sermons:', error);
  setSermons([]);
  sermonAnims.current = [];
} finally {
  setLoadingSermons(false);
}


    setLoadingEvents(true);
    if (selectedCommunityId) {
      const eventsRes = await fetchWithToken(
        `${BASE_URL}/events/upcoming/${selectedCommunityId}`
      );
      if (eventsRes?.success && Array.isArray(eventsRes.data)) {
        const eventData = eventsRes.data.map((event) => ({
          ...event,
          imageUrl: event.imageUrl || FALLBACK_IMAGE,
        }));
        setEvents(eventData);
        eventAnims.current = eventData.map(() => ({
          fade: new Animated.Value(0),
          slide: new Animated.Value(30),
        }));
      } else {
        setEvents([]);
        eventAnims.current = [];
      }
    } else {
      console.warn("No community selected. Skipping upcoming events fetch.");
      setEvents([]);
      eventAnims.current = [];
    }
    setLoadingEvents(false);

    await cacheData();
    animateSections();
  };

  const animateSections = () => {
    const animations = [];

    scriptureAnims.current.forEach((anim) => {
      animations.push(
        Animated.parallel([
          Animated.timing(anim.fade, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(anim.scale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
    });

    sermonAnims.current.forEach((anim, index) => {
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

    eventAnims.current.forEach((anim, index) => {
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

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      ...animations,
    ]).start();
  };

  useEffect(() => {
    const initialize = async () => {
      const hasCache = await loadCachedData();
      await fetchJoinedCommunities();
      if (!hasCache || selectedCommunityId !== null) {
        await fetchData();
      } else {
        animateSections();
      }
    };
    initialize();

    const unsubscribe = navigation.addListener('focus', () => {
      if (initialCommunityIdRef.current !== selectedCommunityId) {
        fetchData(true);
      }
    });

    return unsubscribe;
  }, [navigation, selectedCommunityId]);

  useEffect(() => {
    if (!loadingCommunities && selectedCommunityId !== null && initialCommunityIdRef.current !== selectedCommunityId) {
      fetchData(true);
    }
  }, [selectedCommunityId, loadingCommunities]);

  const onSelectCommunity = async (communityId) => {
    setDropdownVisible(false);
    if (communityId !== selectedCommunityId) {
      setSelectedCommunityId(communityId);
      initialCommunityIdRef.current = communityId;
      await AsyncStorage.setItem('selectedCommunityId', communityId.toString());
      setScriptures([]);
      setSermons([]);
      setEvents([]);
      setCurrentScriptureIndex(0);
      scriptureAnims.current = [];
      sermonAnims.current = [];
      eventAnims.current = [];
      await fetchData(true);
    }
  };

  const handleNextScripture = useCallback(() => {
    if (scriptures.length > 0) {
      const nextIndex = currentScriptureIndex < scriptures.length - 1 ? currentScriptureIndex + 1 : 0;
      setCurrentScriptureIndex(nextIndex);
      Animated.parallel([
        Animated.timing(scriptureAnims.current[nextIndex].fade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scriptureAnims.current[nextIndex].scale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [scriptures.length, currentScriptureIndex]);

  const handlePreviousScripture = useCallback(() => {
    if (scriptures.length > 0) {
      const prevIndex = currentScriptureIndex > 0 ? currentScriptureIndex - 1 : scriptures.length - 1;
      setCurrentScriptureIndex(prevIndex);
      Animated.parallel([
        Animated.timing(scriptureAnims.current[prevIndex].fade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scriptureAnims.current[prevIndex].scale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [scriptures.length, currentScriptureIndex]);

  const handleLike = async () => {
    const currentScripture = scriptures[currentScriptureIndex];
    if (!currentScripture?.id) return;

    try {
      const response = await fetchWithToken(`${BASE_URL}/scriptures/${currentScripture.id}/like`, {
        method: 'POST',
      });

      if (response?.success) {
        setLikes((prev) => ({
          ...prev,
          [currentScripture.id]: (prev[currentScripture.id] || 0) + 1,
        }));
      }
    } catch (error) {
      console.error('Error liking scripture:', error);
    }
  };

  const handleShare = async () => {
    try {
      const currentScripture = scriptures[currentScriptureIndex];
      const shareOptions = {
        message: `${currentScripture?.verse_text}\n\n${currentScripture?.verse_reference}\n${currentScripture?.imageUrl || FALLBACK_IMAGE}`,
      };
      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing scripture:', error);
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
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Fixed Header */}
      <View style={styles.fixedHeader}>
        <View style={styles.navBar}>
          <View style={styles.tabs}>
            <Text style={[styles.tabText, styles.tabActive]}>{labels[language].today}</Text>
            <View style={styles.profileDropdownContainer}>
              <MaterialCommunityIcons name="church" size={24} color={GOLD} />
              {!loadingCommunities && joinedCommunities.length > 0 && (
                selectedCommunityId === null || joinedCommunities.length > 1 ? (
                  <CommunityDropdown />
                ) : (
                  <Text style={styles.dropdownText}>
                    {joinedCommunities.find((c) => c.id === selectedCommunityId)?.name}
                  </Text>
                )
              )}
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

      {/* Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 20, minHeight: height }]}
        ref={scrollRef}
      >
        {/* Scripture of the Day */}
        <View style={styles.section}>
          {loadingScripture ? (
            <ActivityIndicator color={GOLD} style={{ marginTop: 16 }} />
          ) : scriptures.length > 0 ? (
            <View style={styles.scriptureContainer}>
              {/* Small Picture with Scripture Reference */}
              <View style={styles.smallImageContainer}>
                <FlatList
                  data={scriptures}
                  keyExtractor={(item, index) => index.toString()}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={(event) => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / 60);
                    if (index >= 0 && index < scriptures.length) {
                      setCurrentScriptureIndex(index);
                      Animated.parallel([
                        Animated.timing(scriptureAnims.current[index].fade, {
                          toValue: 1,
                          duration: 400,
                          useNativeDriver: true,
                        }),
                        Animated.timing(scriptureAnims.current[index].scale, {
                          toValue: 1,
                          duration: 400,
                          useNativeDriver: true,
                        }),
                      ]).start();
                    }
                  }}
                  renderItem={({ item, index }) => (
                    <Animated.View
                      style={{
                        opacity: scriptureAnims.current[index]?.fade || 0,
                        transform: [{ scale: scriptureAnims.current[index]?.scale || 0.8 }],
                      }}
                    >
                      <View style={styles.smallImageItem}>
                        <Image
                          source={{ uri: item.imageUrl || FALLBACK_IMAGE }}
                          style={styles.smallImage}
                          resizeMode="cover"
                        />
                        <View style={styles.smallImageOverlay}>
                          <Text style={styles.smallVerseText}>{item.verse_reference.toUpperCase()}</Text>
                        </View>
                      </View>
                    </Animated.View>
                  )}
                />
              </View>
              {/* Big Picture with Scripture Text */}
              <Animated.View
                style={{
                  flex: 1,
                  opacity: scriptureAnims.current[currentScriptureIndex]?.fade || 0,
                  transform: [{ scale: scriptureAnims.current[currentScriptureIndex]?.scale || 0.8 }],
                }}
              >
                <View style={styles.wordCard}>
                  <Image
                    source={{ uri: scriptures[currentScriptureIndex]?.imageUrl || FALLBACK_IMAGE }}
                    style={styles.wordImage}
                    resizeMode="cover"
                    onError={(e) => console.log('Scripture image error:', e.nativeEvent.error)}
                  />
                  <View style={styles.wordOverlay} />
                  <View style={styles.wordContent}>
                    <Text style={styles.verseText}>{scriptures[currentScriptureIndex]?.verse_text}</Text>
                  </View>
                  {/* Navigation and Action Buttons */}
                  <View style={styles.actionButtons}>
                    {scriptures.length > 1 && (
                      <>
                        <TouchableOpacity onPress={handlePreviousScripture} style={styles.navButton}>
                          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextScripture} style={styles.navButton}>
                          <Ionicons name="chevron-forward-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                      </>
                    )}
                    <View style={styles.socialButtons}>
                      <View style={styles.socialButtonContainer}>
                        <TouchableOpacity onPress={handleLike} style={styles.socialButton}>
                          <Ionicons name="heart-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.likeCount}>
                          {likes[scriptures[currentScriptureIndex]?.id] || 0}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={handleShare} style={styles.socialButton}>
                        <Ionicons name="share-outline" size={24} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Animated.View>
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
              {sermons.map((sermon, index) => (
                <Animated.View
                  key={sermon.id}
                  style={{
                    opacity: sermonAnims.current[index]?.fade || 0,
                    transform: [{ translateX: sermonAnims.current[index]?.slide || 30 }],
                  }}
                >
                  <TouchableOpacity
                    style={styles.sermonCard}
                    activeOpacity={0.8}
                    onPress={() =>
                      router.push({
                        pathname: '/sermon',
                        params: { id: sermon.id },
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
                      <Text style={styles.sermonDescription} numberOfLines={2}></Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
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
              {events.map((event, index) => (
                <Animated.View
                  key={event.id}
                  style={{
                    opacity: eventAnims.current[index]?.fade || 0,
                    transform: [{ translateY: eventAnims.current[index]?.slide || 30 }],
                  }}
                >
                  <TouchableOpacity
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
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
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
                </Animated.View>
              ))}
            </View>
          ) : (
            <Text style={{ paddingHorizontal: 16, color: '#666' }}>
              {language === 'sw' ? 'Hakuna matukio yanayopatikana.' : 'No events found.'}
            </Text>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  fixedHeader: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 1 : 49,
    paddingHorizontal: 16,
    paddingBottom: 8,
    zIndex: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  navBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  tabs: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  tabText: { 
    fontSize: 14, 
    marginRight: 4, 
    fontFamily: 'GothamBold' 
  },
  tabActive: { 
    color: GOLD 
  },
  icons: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  iconTouchable: { 
    marginRight: 12, 
    padding: 4, 
    borderRadius: 6 
  },
  greetingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 6 
  },
  greetingText: { 
    fontSize: 12, 
    color: '#777', 
    marginLeft: 6, 
    fontFamily: 'GothamBold' 
  },
  profileDropdownContainer: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  dropdownToggle: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginLeft: 6, 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderWidth: 1, 
    borderColor: GOLD, 
    borderRadius: 6 
  },
  dropdownText: { 
    fontSize: 12, 
    color: GOLD, 
    marginRight: 4, 
    fontFamily: 'GothamBold' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.3)' 
  },
  dropdownListContainer: { 
    position: 'absolute', 
    top: 110, 
    right: 16, 
    width: 200, 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    maxHeight: 250, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 10, 
    elevation: 10 
  },
  dropdownItem: { 
    paddingVertical: 12, 
    paddingHorizontal: 16 
  },
  dropdownItemSelected: { 
    backgroundColor: GOLD 
  },
  dropdownItemText: { 
    fontSize: 14, 
    color: '#222', 
    fontFamily: 'GothamRegular' 
  },
  dropdownItemTextSelected: { 
    color: '#FFFFFF', 
    fontFamily: 'GothamBold' 
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? -90 : -100, // Adjust based on header height
  },
  section: { 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 15, 
    color: '#222', 
    paddingHorizontal: 16, 
    fontFamily: 'GothamBold' 
  },
scriptureContainer: { 
  flexDirection: 'row', 
  marginHorizontal: 16, 
  alignItems: 'center', 
  paddingVertical: 10, // reduced from 10
},

  smallImageContainer: { 
    width: 60, 
    height: 250, 
    borderRadius: 10, 
    overflow: 'hidden', 
    marginRight: 12 
  },
  smallImageItem: { 
    width: 60, 
    height: 250, 
    position: 'relative', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  smallImage: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute' 
  },
  smallImageOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  smallVerseText: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -125 }, { translateY: -25 }, { rotate: '90deg' }],
    color: '#fff',
    fontSize: 20,
    fontWeight: 900,
    textAlign: 'center',
    width: 230,
    height: 50,
    includeFontPadding: false,
    textTransform: 'uppercase',
    fontFamily: 'GothamBold',
  },
  wordCard: { 
    flex: 1, 
    height: 250, 
    overflow: 'hidden', 
    backgroundColor: '#fff', 
    position: 'relative' 
  },
  wordImage: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 10, 
    position: 'absolute', 
    top: 0, 
    left: 0 
  },
  wordOverlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    borderRadius: 10 
  },
  wordContent: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 15, 
    position: 'relative' 
  },
  verseText: { 
    color: '#fff', 
    fontSize: 15, 
    lineHeight: 24, 
    textAlign: 'center', 
    fontFamily: 'GothamMedium', 
    fontWeight: 500 
  },
  sermonCard: { 
    width: 110, 
    height: 80, 
    borderRadius: 12, 
    marginRight: 16, 
    overflow: 'hidden', 
    elevation: 4, 
    backgroundColor: '#000' 
  },
  sermonImage: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute' 
  },
  sermonOverlay: { 
    flex: 3, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    paddingHorizontal: 6, 
    paddingBottom: 6 
  },
  sermonTitle: { 
    color: '#fff', 
    fontSize: 11, 
    fontWeight: 500,
    textAlign: 'center', 
    marginLeft: 'auto', 
    marginRight: 'auto', 
    display: 'block', 
    fontFamily: 'GothamBold' 
  },
  titleOverlay: {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: [{ translateX: -50 }, { translateY: -50 }],
  justifyContent: 'center',
  alignItems: 'center',
},

  sermonDescription: { 
    color: '#fff', 
    fontSize: 9, 
    marginTop: 2, 
    fontFamily: 'GothamBold' 
  },
  eventCardVertical: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 8, 
    marginBottom: 8, 
    // shadowColor: '#000', 
    // shadowOpacity: 0.05, 
    // shadowOffset: { width: 0, height: 1 }, 
    // shadowRadius: 2, 
    // elevation: 1 
  },
  eventImageVertical: { 
    width: 110, 
    height: 80, 
    borderRadius: 8, 
    marginRight: 12, 
    backgroundColor: '#eee' 
  },
  eventInfoVertical: { 
    flex: 1, 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    justifyContent: 'center' 
  },
  eventName: { 
    fontSize: 13, 
    color: '#222', 
    fontFamily: 'GothamBold' 
  },
  eventTime: { 
    fontSize: 12, 
    color: GOLD, 
    marginTop: 2, 
    fontFamily: 'GothamBold' 
  },
  eventLocation: { 
    fontSize: 11, 
    color: '#666', 
    marginTop: 2, 
    fontFamily: 'GothamRegular' 
  },
  actionButtons: { 
    position: 'absolute', 
    bottom: 10, 
    left: 10, 
    right: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  navButton: { 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 20, 
    padding: 5 
  },
  socialButtons: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    flex: 1, 
    alignItems: 'center' 
  },
  socialButtonContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 5 
  },
  socialButton: { 
    padding: 5 
  },
  likeCount: { 
    color: '#fff', 
    fontSize: 12, 
    marginLeft: 5, 
    fontFamily: 'GothamRegular' 
  },
});