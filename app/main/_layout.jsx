// import { Tabs } from 'expo-router';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// import { StyleSheet, View, Text, Platform } from 'react-native';

// export default function Layout() {
//   return (
//     <Tabs
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarActiveTintColor: '#FFA500', // active orange
//         tabBarInactiveTintColor: '#6B4F4F', // gray
//         tabBarStyle: styles.bottomNav,
//         tabBarItemStyle: styles.navItem,
//         tabBarHideOnKeyboard: true,
//         tabBarLabelStyle: { fontSize: 10, marginTop: 2 }, // fixed label size
//         tabBarIcon: ({ focused, color }) => {
//           let iconName;
//           let IconComponent = Ionicons;

//           if (route.name === 'index1') {
//             iconName = 'home-outline';
//           } else if (route.name === 'bible') {
//             IconComponent = MaterialCommunityIcons;
//             iconName = 'calendar';
//           } else if (route.name === 'contribution') {
//             IconComponent = MaterialCommunityIcons;
//             iconName = 'hand-heart-outline';
//           } else if (route.name === 'community') {
//             IconComponent = MaterialCommunityIcons;
//             iconName = 'account-group-outline';
//           }

//           return (
//             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//               <IconComponent name={iconName} size={22} color={color} />
//             </View>
//           );
//         },
//       })}
//     >
//       {['getstarted', 'login', 'register'].map((screen) => (
//         <Tabs.Screen
//           key={screen}
//           name={screen}
//           options={{
//             tabBarStyle: { display: 'none' },
//             headerShown: false,
//           }}
//         />
//       ))}

//       <Tabs.Screen name="index1" options={{ title: 'Home' }} />
//       <Tabs.Screen name="bible" options={{ title: 'Events' }} />
//       <Tabs.Screen name="contribution" options={{ title: 'Give' }} />
//       <Tabs.Screen name="community" options={{ title: 'Communities' }} />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   bottomNav: {
//     position: 'absolute',
//     bottom: Platform.OS === 'ios' ? -40 : 2, // iOS: -35, Android: 0 // 👈 Ensures it sits directly at the bottom
//     left: 0,
//     right: 0,
//     height: 80, // 👈 Slightly increased to help cover safe areas
//     backgroundColor: '#FFF3D4', // 👈 Light orange background
//     flexDirection: 'row',
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     borderTopWidth: 0.5,
//     borderTopColor: '#FFD699',
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: -2 },
//     shadowRadius: 4,
//     elevation: 5,
//     paddingBottom: Platform.OS === 'ios' ? 20 : 10, // 👈 Helps cover iPhone bottom space
//     paddingTop: 5,
//   },
//   navItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingTop: 4,
//   },
// });
import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/CustomTabBar';

export default function Layout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      {['getstarted', 'login', 'register'].map((screen) => (
        <Tabs.Screen
          key={screen}
          name={screen}
          options={{ tabBarStyle: { display: 'none' } }}
        />
      ))}

      <Tabs.Screen name="index1" options={{ title: 'Home' }} />
      <Tabs.Screen name="bible" options={{ title: 'Events' }} />
      <Tabs.Screen name="contribution" options={{ title: 'Give' }} />
      <Tabs.Screen name="community" options={{ title: 'Communities' }} />
    </Tabs>
  );
}
