import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const { width, height } = Dimensions.get('window');
const GOLD = '#FFA500';

export default function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef(null);

  const [language, setLanguage] = useState('en'); // 'en' or 'sw'
  const toggleLanguage = () => setLanguage((prev) => (prev === 'en' ? 'sw' : 'en'));

  const [activeTab, setActiveTab] = useState('Today');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (language === 'sw') {
      if (hour < 12) return 'HABARI ZA ASUBUHI';
      if (hour < 18) return 'HABARI ZA MCHANA, ALBERT';
      return 'HABARI ZA JIONI';
    } else {
      if (hour < 12) return 'GOOD MORNING';
      if (hour < 18) return 'GOOD AFTERNOON, ALBERT';
      return 'GOOD EVENING';
    }
  };

  const labels = {
    en: { today: 'Today', sermons: 'Sermons', events: 'Upcoming Events' },
    sw: { today: 'Leo', sermons: 'Mahubiri', events: 'Matukio Yanayokuja' },
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
      videoId: 'dQw4w9WgXcQ',
      img: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    },
    {
      title: 'Faith',
      videoId: 'ysz5S6PUM-U',
      img: 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg',
    },
        {
      title: 'Faith',
      videoId: 'ysz5S6PUM-U',
      img: 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg',
    },
        {
      title: 'Faith',
      videoId: 'ysz5S6PUM-U',
      img: 'https://img.youtube.com/vi/ysz5S6PUM-U/hqdefault.jpg',
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
      name: 'Worship Night',
      img: 'https://i.pravatar.cc/100?img=2',
      time: '7:00 PM',
      location: 'Main Hall',
    },
    {
      id: 1,
      name: 'Pastor preaching',
      img: 'https://i.pravatar.cc/100?img=1',
      time: '10:00 AM',
      location: 'Main Hall',
    },
    {
      id: 1,
      name: 'Pastor preaching',
      img: 'https://i.pravatar.cc/100?img=1',
      time: '10:00 AM',
      location: 'Main Hall',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, minHeight: height }}
      >
        {/* Header */}
        <View style={styles.customHeader}>
          <View style={styles.navBar}>
            <View style={styles.tabs}>
              <Text style={[styles.tabText, styles.tabActive]}>
                {labels[language].today}
              </Text>
              <TouchableOpacity onPress={() => router.push('/#')} style={{ marginLeft: 8 }}>
                <Ionicons name="person-circle-outline" size={24} color={GOLD} />
              </TouchableOpacity>
            </View>
            <View style={styles.icons}>
              <TouchableOpacity onPress={toggleLanguage} style={styles.iconTouchable}>
                <Ionicons name="globe-outline" size={20} color={GOLD} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push('/notification')} style={styles.iconTouchable}>
                <Ionicons name="notifications-outline" size={20} color={GOLD} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.greetingRow}>
            <Ionicons name="sunny-outline" size={16} color="#888" />
            <Text style={styles.greetingText}> {getGreeting()}</Text>
          </View>
        </View>

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
                style={[styles.wordCard, { marginRight: index !== wordOfDay.length - 1 ? 16 : 0 }]}
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
          <Text style={styles.sectionTitle}>{labels[language].sermons}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, marginTop: 8 }}
          >
            {sermons.map((sermon, i) => (
              <View key={i} style={styles.sermonCard}>
                {Platform.OS === 'android' || Platform.OS === 'ios' ? (
                  <YoutubePlayer height={70} play={false} videoId={sermon.videoId} />
                ) : (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${sermon.videoId}`)}
                    style={{ flex: 1 }}
                  >
                    <Image source={{ uri: sermon.img }} style={styles.sermonImage} />
                    <View style={styles.sermonOverlay}>
                      <Text style={styles.sermonTitle}>{sermon.title}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Events */}
        <View style={[styles.section, { paddingBottom: 20 }]}>
          <Text style={styles.sectionTitle}>{labels[language].events}</Text>
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
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
    </View>
  );
}
// === Styles ===

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
  tabText: { fontSize: 14, fontWeight: 'bold', marginRight: 4 },
  tabActive: { color: GOLD },
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
    backgroundColor: '#000',
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
    borderWidth: 1,
    borderColor: GOLD,
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
