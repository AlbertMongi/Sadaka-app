// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ImageBackground,
//   StatusBar,
//   Dimensions,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import { useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import Swiper from 'react-native-swiper';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useFonts } from 'expo-font';
// import * as SplashScreen from 'expo-splash-screen';

// const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

// const images = [
//   'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg',
//   'https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg',
// ];

// // Safe atob fallback
// const atob = global.atob
//   ? global.atob
//   : (input) => {
//       const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
//       let str = input.replace(/=+$/, '');
//       let output = '';
//       if (str.length % 4 === 1) {
//         throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
//       }
//       for (let bc = 0, bs = 0, buffer, idx = 0; (buffer = str.charAt(idx++)); ) {
//         buffer = chars.indexOf(buffer);
//         bs = bc % 4 ? bs * 64 + buffer : buffer;
//         bc++;
//         if (bc % 4) {
//           output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
//         }
//       }
//       return output;
//     };

// const isTokenExpired = (token) => {
//   if (!token) return true;
//   try {
//     const payloadBase64 = token.split('.')[1];
//     const decodedPayload = JSON.parse(atob(payloadBase64));
//     const exp = decodedPayload.exp;
//     return !exp || exp < Math.floor(Date.now() / 1000);
//   } catch {
//     return true;
//   }
// };

// export default function GetStarted() {
//   const router = useRouter();
//   const [appIsReady, setAppIsReady] = useState(false);

//   const [fontsLoaded] = useFonts({
//     GothamBold: require('../assets/fonts/Gotham-Bold.ttf'),
//     GothamLight: require('../assets/fonts/Gotham-Light.ttf'),
//     GothamRegular: require('../assets/fonts/Gotham-Book.otf'),
//     GothamMedium: require('../assets/fonts/Gotham-Medium.ttf'),
//   });

//   useEffect(() => {
//     async function prepare() {
//       try {
//         await SplashScreen.preventAutoHideAsync();

//         // Wait for fonts
//         if (!fontsLoaded) return;

//         // Check token
//         const userToken = await AsyncStorage.getItem('userToken');
//         if (userToken && !isTokenExpired(userToken)) {
//           router.replace('/main/index1');
//         }

//         // Delay to simulate loading if needed
//         await new Promise((resolve) => setTimeout(resolve, 300));
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         setAppIsReady(true);
//         await SplashScreen.hideAsync();
//       }
//     }

//     prepare();
//   }, [fontsLoaded]);

//   if (!appIsReady || !fontsLoaded) {
//     return null; // Let SplashScreen stay
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

//       <View style={styles.swiperContainer}>
//         <Swiper
//           autoplay
//           autoplayTimeout={4}
//           loop
//           showsPagination
//           dotStyle={styles.dot}
//           activeDotStyle={styles.activeDot}
//           paginationStyle={styles.pagination}
//         >
//           {images.map((uri, index) => (
//             <ImageBackground
//               key={index}
//               source={{ uri }}
//               resizeMode="cover"
//               style={styles.fullscreenImage}
//             >
//               <View style={styles.overlay} />
//             </ImageBackground>
//           ))}
//         </Swiper>
//       </View>

//       <View style={styles.overlayContent}>
//         <View style={styles.textWrapper}>
//           <Text style={styles.heading}>Welcome to</Text>
//           <Text style={styles.appName}>Sadaka App</Text>
//           <Text style={styles.subText}>Connect. Worship. Grow Together.</Text>
//         </View>

//         <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
//           <Text style={styles.buttonText}>Get Started</Text>
//           <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#000' },
//   swiperContainer: { position: 'absolute', width: screenWidth, height: screenHeight },
//   fullscreenImage: { width: screenWidth, height: screenHeight },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   overlayContent: {
//     ...StyleSheet.absoluteFillObject,
//     paddingHorizontal: 24,
//     paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 40,
//     paddingBottom: 40,
//   },
//   textWrapper: { alignItems: 'center' },
//   heading: {
//     fontSize: 22,
//     color: '#fff',
//     marginBottom: 6,
//     letterSpacing: 1,
//     fontFamily: 'GothamLight',
//   },
//   appName: {
//     fontSize: 42,
//     color: '#FF8C00',
//     letterSpacing: 1,
//     fontFamily: 'GothamBold',
//   },
//   subText: {
//     marginTop: 10,
//     fontSize: 14,
//     color: '#fefefe',
//     textAlign: 'center',
//     paddingHorizontal: 30,
//     lineHeight: 20,
//     fontFamily: 'GothamRegular',
//   },
//   button: {
//     backgroundColor: '#FF8C00',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingVertical: 14,
//     borderRadius: 12,
//     marginHorizontal: 20,
//     shadowColor: '#000',
//     shadowOpacity: 0.12,
//     shadowOffset: { width: 0, height: 3 },
//     shadowRadius: 5,
//     elevation: 5,
//     position: 'absolute',
//     bottom: 40,
//     left: 24,
//     right: 24,
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontFamily: 'GothamBold',
//   },
//   pagination: { bottom: 80 },
//   dot: {
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     marginHorizontal: 2,
//   },
//   activeDot: {
//     backgroundColor: '#FF8C00',
//     width: 7,
//     height: 7,
//     borderRadius: 3.5,
//     marginHorizontal: 2,
//   },
// });
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Swiper from 'react-native-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const { height: screenHeight, width: screenWidth } = Dimensions.get('screen');

const images = [
  'https://images.pexels.com/photos/1666816/pexels-photo-1666816.jpeg',
  'https://images.pexels.com/photos/267559/pexels-photo-267559.jpeg',
];

// Safe atob fallback
const atob = global.atob
  ? global.atob
  : (input) => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      let str = input.replace(/=+$/, '');
      let output = '';
      if (str.length % 4 === 1) {
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      }
      for (let bc = 0, bs = 0, buffer, idx = 0; (buffer = str.charAt(idx++)); ) {
        buffer = chars.indexOf(buffer);
        bs = bc % 4 ? bs * 64 + buffer : buffer;
        bc++;
        if (bc % 4) {
          output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6)));
        }
      }
      return output;
    };

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));
    const exp = decodedPayload.exp;
    return !exp || exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
};

export default function GetStarted() {
  const router = useRouter();
  const [appIsReady, setAppIsReady] = useState(false);

  const [fontsLoaded] = useFonts({
    GothamBold: require('../assets/fonts/Gotham-Bold.ttf'),
    GothamLight: require('../assets/fonts/Gotham-Light.ttf'),
    GothamRegular: require('../assets/fonts/Gotham-Book.otf'),
    GothamMedium: require('../assets/fonts/Gotham-Medium.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();

        // Wait for fonts
        if (!fontsLoaded) return;

        // Check token
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken && !isTokenExpired(userToken)) {
          router.replace('/main/index1');
        }

        // Delay to simulate loading if needed
        await new Promise((resolve) => setTimeout(resolve, 300));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={styles.loaderText}>Sadaka App</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

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
          {images.map((uri, index) => (
            <ImageBackground
              key={index}
              source={{ uri }}
              resizeMode="cover"
              style={styles.fullscreenImage}
            >
              <View style={styles.overlay} />
            </ImageBackground>
          ))}
        </Swiper>
      </View>

      <View style={styles.overlayContent}>
        <View style={styles.textWrapper}>
          <Text style={styles.heading}>Welcome to</Text>
          <Text style={styles.appName}>Sadaka App</Text>
          <Text style={styles.subText}>Connect. Worship. Grow Together.</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/register')}>
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  swiperContainer: { position: 'absolute', width: screenWidth, height: screenHeight },
  fullscreenImage: { width: screenWidth, height: screenHeight },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayContent: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 40,
    paddingBottom: 40,
  },
  textWrapper: { alignItems: 'center' },
  heading: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 6,
    letterSpacing: 1,
    fontFamily: 'GothamLight',
  },
  appName: {
    fontSize: 42,
    color: '#FF8C00',
    letterSpacing: 1,
    fontFamily: 'GothamBold',
  },
  subText: {
    marginTop: 10,
    fontSize: 14,
    color: '#fefefe',
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 20,
    fontFamily: 'GothamRegular',
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
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'GothamBold',
  },
  pagination: { bottom: 80 },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.3)',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 24,
    color: '#FF8C00',
    fontFamily: 'GothamBold', // Use same font as appName for consistency
  },
});