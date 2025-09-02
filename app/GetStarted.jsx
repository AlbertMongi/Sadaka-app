import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';

const { width } = Dimensions.get('window');

// const IMAGES = [
//   { id: '1', uri: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg' },
//   { id: '2', uri: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg' },
//   { id: '3', uri: 'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg' },
// ];

export default function GetStarted({ navigation }) {
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % IMAGES.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <SafeAreaView style={styles.safeArea}>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff', // ✅ White background
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topContent: {
    marginTop: 40,
    alignItems: 'center',
  },
  welcomeText: {
    color: '#FF69B4',
    fontSize: 20,
    fontFamily: 'Comic Sans MS',
    textAlign: 'center',
    textShadowColor: '#00000020',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
  },
  button: {
    backgroundColor: '#FFB6C1',
    paddingVertical: 10,
    width: '80%',
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#FF69B4',
  },
  buttonText: {
    color: '#FF1493',
    fontSize: 16,
    fontFamily: 'Comic Sans MS',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
