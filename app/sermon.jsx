import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SermonDetailScreen() {
  const { title } = useLocalSearchParams();
  const router = useRouter();

  const sermonInfo = {
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    description: `This sermon, titled "${title}", explores the deep truths of God's word. It dives into how we can live by faith, overcome challenges, and grow in spiritual maturity.

Through biblical examples and real-life stories, we are reminded to trust in God's timing, lean not on our own understanding, and walk boldly in His promises.

This message is meant to inspire, challenge, and encourage you in your spiritual journey. Whether you're new in the faith or have walked with God for years, this sermon will speak directly to your heart.`,
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#FF8C00" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sermon</Text>
        <View style={{ width: 24 }} /> {/* placeholder to balance layout */}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: sermonInfo.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{sermonInfo.description}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    justifyContent: 'space-between',
    borderBottomWidth: 0.3,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  image: {
    width: '100%',
    height: 230,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginHorizontal: 20,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginTop: 12,
    marginHorizontal: 20,
    lineHeight: 24,
  },
});
