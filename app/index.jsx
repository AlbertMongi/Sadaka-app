import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

// Fix for any timing issues
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// Get screen dimensions
const { height: screenHeight, width: screenWidth } = Dimensions.get('screen'); // Use 'screen' for full dimensions

const images = [
  'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg',
  'https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg',
];

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Make StatusBar transparent and overlay content */}
      <StatusBar 
        translucent={true} 
        backgroundColor="transparent" 
        barStyle="light-content" 
      />

      {/* Full-screen Swiper that covers entire screen */}
      <View style={styles.swiperContainer}>
        <Swiper
          autoplay
          autoplayTimeout={4}
          loop
          showsPagination
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
          paginationStyle={styles.pagination}
        >
          {images.map((image, index) => (
            <ImageBackground
              key={index}
              source={{ uri: image }}
              resizeMode="cover"
              style={styles.fullscreenImage}
            >
              <View style={styles.overlay} />
            </ImageBackground>
          ))}
        </Swiper>
      </View>

      {/* Overlay UI - Positioned absolutely over swiper */}
      <View style={styles.overlayContent}>
        <View style={styles.textWrapper}>
          <Text style={styles.heading}>Welcome to</Text>
          <Text style={styles.appName}>Sadaka App</Text>
          <Text style={styles.subText}>Connect. Worship. Grow Together.</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color="#fff"
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Fallback background color
  },
  swiperContainer: {
    position: 'absolute',
    top: 0, // Ensure it starts at the very top
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight, // Full screen height, including status bar
  },
  fullscreenImage: {
    width: screenWidth,
    height: screenHeight, // Full screen height, including status bar
    flex: 1, // Ensure it takes up all available space
    position: 'absolute', // Ensure image starts at top-left
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  overlayContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' 
      ? (StatusBar.currentHeight || 0) + 20 // Reduced padding to bring text closer to top
      : 40, // Adjusted for iOS
    paddingBottom: 40,
  },
  textWrapper: {
    alignItems: 'center',
    marginTop: 0, // Remove margin to position text closer to top
  },
  heading: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '400',
    marginBottom: 6,
    letterSpacing: 1,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: '#FF8C00',
    letterSpacing: 1,
  },
  subText: {
    marginTop: 10,
    fontSize: 14,
    color: '#fefefe',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#FF8C00',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    position: 'absolute', // Keep button at bottom
    bottom: 40,
    left: 24,
    right: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    bottom: 80, // Position dots above the button
  },
  dot: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#FF8C00',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginHorizontal: 2,
  },
});