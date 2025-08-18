import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

export default function GetStarted({ navigation }) {
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1590073242668-90f8a8db7e7e' }} // Cute background with flowers or pastel theme
      style={styles.container}
    >
      <View style={styles.overlay} />

      <View style={styles.topContent}>
        <Text style={styles.welcomeText}>Welcome to Sadaka!</Text>
        <Image
          source={{ uri: 'https://cdn.pixabay.com/photo/2016/03/31/14/43/teddy-bear-1292199_1280.jpg' }} // Cute teddy bear image
          style={styles.characterImage}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Index1')}
        >
          <Text style={styles.buttonText}>Let’s Start!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 182, 193, 0.2)', // Light pink tint
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(135, 206, 235, 0.3)', // Light baby blue overlay
  },
  topContent: {
    marginTop: 60,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeText: {
    color: '#FF69B4', // Hot pink for cuteness
    fontSize: 18,
    fontFamily: 'Comic Sans MS', // Playful font (ensure it's available or use a custom cute font)
    textAlign: 'center',
    textShadowColor: '#FFC0CB88', // Light pink shadow
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  characterImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 50, // Rounded image for cuteness
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
  },
  button: {
    backgroundColor: '#FFB6C1', // Light pink button
    paddingVertical: 12,
    width: '90%', // Slightly less than 100% for a cute margin
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF69B4', // Hot pink border
  },
  buttonText: {
    color: '#FF1493', // Deep pink text
    fontSize: 12,
    fontFamily: 'Comic Sans MS', // Playful font
    fontWeight: 'bold',
    textAlign: 'center',
  },
});