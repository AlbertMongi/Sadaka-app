import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [activeTab, setActiveTab] = useState('Today');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'GOOD MORNING, ALBERT';
    if (hour < 18) return 'GOOD AFTERNOON, ALBERT';
    return 'GOOD EVENING';
  };

  const wordOfDay = [
    {
      verse:
        'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
      ref: 'Joshua 1:9',
      img: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    },
  ];

  const sermons = [
    {
      title: 'Lent',
      img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    },
    {
      title: 'Lent',
      img: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      name: 'Pastor preaching',
      img: 'https://i.pravatar.cc/100?img=1',
      time: '10:00 AM',
      location: 'Main Hall',
    },
    {
      id: 2,
      name: 'Youth Fellowship',
      img: 'https://i.pravatar.cc/100?img=2',
      time: '5:00 PM',
      location: 'Room 202',
    },
    {
      id: 3,
      name: 'Bible Study',
      img: 'https://i.pravatar.cc/100?img=3',
      time: '7:00 PM',
      location: 'Library',
    },
  ];

  const onTabPress = (tab) => {
    setActiveTab(tab);
    scrollRef.current.scrollTo({ x: tab === 'Today' ? 0 : width, animated: true });
  };

  const onScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    setActiveTab(x >= width / 2 ? 'Community' : 'Today');
  };

  // COMMUNITY PAGE
  const CommunityPage = () => {
    const [communities] = useState([
      {
        id: '1',
        name: 'Youth Group',
        description: 'Engaging youth in fellowship and worship.',
        img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=64&q=80',
        enabled: true,
      },
      {
        id: '2',
        name: 'Bible Study',
        description: 'Dive deep into the scriptures every week.',
        img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=64&q=80',
        enabled: false,
      },
      {
        id: '3',
        name: 'Choir',
        description: 'Lifting voices in praise and worship.',
        img: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=64&q=80',
        enabled: true,
      },
      {
        id: '4',
        name: 'Prayer Warriors',
        description: 'Dedicated to continuous prayer for the church.',
        img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=64&q=80',
        enabled: false,
      },
    ]);

    const followedCommunities = communities.filter((community) => community.enabled);

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose a community to switch</Text>
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          {followedCommunities.map((item) => (
            <View key={item.id} style={styles.eventCardVertical}>
              <Image source={{ uri: item.img }} style={styles.eventImageVertical} />
              <View style={styles.eventInfoVertical}>
                <Text style={styles.eventName}>{item.name}</Text>
                <Text style={styles.eventLocation}>{item.description}</Text>
              </View>
            </View>
          ))}
          {followedCommunities.length === 0 && (
            <Text style={{ textAlign: 'center', color: '#888', marginTop: 20 }}>
              You have not followed any communities yet.
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.customHeader}>
        <View style={styles.navBar}>
          <View style={styles.tabs}>
            <TouchableOpacity onPress={() => onTabPress('Today')}>
              <Text style={[styles.tabText, activeTab === 'Today' ? styles.tabActive : styles.tabInactive]}>
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onTabPress('Community')}>
              <Text style={[styles.tabText, activeTab === 'Community' ? styles.tabActive : styles.tabInactive]}>
                Community
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => router.push('/notification')} style={styles.iconTouchable}>
              <Ionicons name="notifications-outline" size={20} color="gold" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.greetingRow}>
          <Ionicons name="sunny-outline" size={16} color="#888" />
          <Text style={styles.greetingText}> {getGreeting()}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
      >
        {/* TODAY TAB */}
        <ScrollView
          style={{ width, backgroundColor: '#fff' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Word of the Day */}
          <View style={styles.section}>
            <ScrollView
              horizontal
              pagingEnabled
              snapToInterval={width - 48}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 16, paddingRight: 16, marginTop: 12 }}
            >
              {wordOfDay.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.wordCard,
                    { marginRight: index !== wordOfDay.length - 1 ? 16 : 0 },
                  ]}
                >
                  <Image source={{ uri: item.img }} style={styles.wordImage} resizeMode="cover" />
                  <View style={styles.wordOverlay} />
                  <View style={styles.wordContent}>
                    <Text style={styles.verseRef}>{item.ref}</Text>
                    <Text style={styles.verseText}>{item.verse}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Sermons */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sermons</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, marginTop: 8 }}
            >
              {sermons.map((sermon, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.sermonCard}
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: 'sermon', params: { title: sermon.title } })}
                >
                  <Image source={{ uri: sermon.img }} style={styles.sermonImage} />
                  <View style={styles.sermonOverlay}>
                    <Text style={styles.sermonTitle}>{sermon.title}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Upcoming Events */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <View style={{ paddingHorizontal: 16, marginTop: 8, paddingBottom: 40 }}>
              {upcomingEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCardVertical}
                  activeOpacity={0.8}
                  onPress={() => router.push({ pathname: 'events', params: { name: event.name } })}
                >
                  <Image source={{ uri: event.img }} style={styles.eventImageVertical} />
                  <View style={styles.eventInfoVertical}>
                    <Text style={styles.eventName}>{event.name}</Text>
                    <Text style={styles.eventTime}>{event.time}</Text>
                    <Text style={styles.eventLocation}>{event.location}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* COMMUNITY TAB */}
        <ScrollView
          style={{ width, backgroundColor: '#fff' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <CommunityPage />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 15 },

  customHeader: {
    backgroundColor: '#fff',
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tabs: { flexDirection: 'row', alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: 'bold', marginRight: 12 },
  tabActive: { color: 'orange' },
  tabInactive: { color: '#999' },
  icons: { flexDirection: 'row', alignItems: 'center' },
  iconTouchable: { marginRight: 12, padding: 4, borderRadius: 6 },

  greetingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  greetingText: { fontSize: 12, color: '#777', fontWeight: '600', marginLeft: 6 },

  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    paddingHorizontal: 16,
  },

  wordCard: {
    width: width - 48,
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    position: 'relative',
  },
  wordImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
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
  },
  verseRef: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  verseText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },

  sermonCard: {
    width: 110,
    height: 70,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  sermonImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sermonOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  sermonTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },

  eventCardVertical: {
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 12,
    marginBottom: 14,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  eventImageVertical: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#ccc',
  },
  eventInfoVertical: { flex: 1 },
  eventName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  eventTime: { fontSize: 12, color: '#555', marginBottom: 2 },
  eventLocation: { fontSize: 12, color: '#555' },
});
