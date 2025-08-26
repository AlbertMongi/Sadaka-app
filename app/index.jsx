import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function GetStarted() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1350&q=80',
      }}
      style={styles.background}
    >
      <View style={styles.overlay} />

      <SafeAreaView style={styles.container}>
        {/* Top Welcome Text */}
        <View style={styles.textWrapper}>
          <Text style={styles.heading}>Welcome to</Text>
          <Text style={styles.appName}>Sadaka App</Text>
          <Text style={styles.subText}>Connect. Worship. Grow Together.</Text>
        </View>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    flex: 1,
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
});
