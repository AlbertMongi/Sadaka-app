import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';

// Polyfill setImmediate if undefined
if (typeof setImmediate === 'undefined') {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

const { width, height } = Dimensions.get('window');

// Array of image URLs for sliding
const images = [
  'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg',
  'https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg',
  // Add more image URLs if needed
];

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <Swiper
        autoplay
        autoplayTimeout={4}
        loop
        showsPagination={true}
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
      >
        {images.map((image, index) => (
          <ImageBackground
            key={index}
            source={{ uri: image }}
            style={styles.background}
          >
            <View style={styles.overlay} />
          </ImageBackground>
        ))}
      </Swiper>

      {/* Overlay Content */}
      <SafeAreaView style={styles.container}>
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
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    width: width,
    height: height,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  textWrapper: {
    marginTop: 100,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '400',
    marginBottom: 6,
    letterSpacing: 1,
  },
  appName: {
    fontSize: 32,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
