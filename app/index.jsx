import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function GetStarted() {
  const router = useRouter(); // ✅ correct navigation in Expo Router

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
      style={styles.container}
    >
      <View style={styles.overlay} />

      <View style={styles.topTextContainer}>
        <Text style={styles.welcomeText}>WELCOME TO SADAKA APP</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')} // ✅ correct navigation
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  topTextContainer: { marginTop: 80, alignItems: 'center', paddingHorizontal: 20 },
  welcomeText: {
    color: 'gold',
    fontSize: 24,
    fontFamily: 'Cursive',
    textAlign: 'center',
    textShadowColor: '#00000088',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  buttonContainer: { width: '100%', alignItems: 'center', paddingBottom: 50 },
  button: { backgroundColor: 'transparent', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 40, borderWidth: 2, borderColor: 'gold' },
  buttonText: { color: 'gold', fontSize: 16, fontFamily: 'Cursive', fontWeight: 'bold', textAlign: 'center' },
});
