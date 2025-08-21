import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
  Image,
  Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const IMAGES = [
  { id: '1', uri: 'https://cdn.pixabay.com/photo/2016/03/31/14/43/teddy-bear-1292199_1280.jpg' },
  { id: '2', uri: 'https://cdn.pixabay.com/photo/2017/02/23/13/05/bear-2093207_1280.jpg' },
  { id: '3', uri: 'https://cdn.pixabay.com/photo/2018/10/22/18/13/teddy-3766389_1280.jpg' },
];

export default function GetStarted({ navigation }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slide images automatically
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % IMAGES.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1590073242668-90f8a8db7e7e' }}
      style={styles.container}
    >
      <View style={styles.overlay} />

      <View style={styles.topContent}>
        <Text style={styles.welcomeText}>Welcome to Sadaka!</Text>
        <FlatList
          ref={flatListRef}
          data={IMAGES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Image source={{ uri: item.uri }} style={styles.characterImage} />
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('main/Index1')}
        >
          <Text style={styles.buttonText}>GET STARTED</Text>
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    zIndex: 0,
  },
  topContent: {
    marginTop: 60,
    alignItems: 'center',
    zIndex: 1,
  },
  welcomeText: {
    color: '#FF69B4',
    fontSize: 20,
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    textShadowColor: '#00000055',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 15,
  },
  characterImage: {
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    marginHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 30,
    zIndex: 1,
  },
  button: {
    backgroundColor: '#FFB6C1',
    paddingVertical: 8,
    width: '100%',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF69B4',
  },
  buttonText: {
    color: '#FF1493',
    fontSize: 14,
    fontFamily: 'Comic Sans MS',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
