import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#6B4F4F',
        tabBarStyle: styles.bottomNav,
        tabBarItemStyle: styles.navItem,
        tabBarLabelStyle: styles.tabLabel,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let IconComponent = Ionicons;

          if (route.name === 'index1') iconName = 'home-outline';
          else if (route.name === 'bible') {
            IconComponent = MaterialCommunityIcons;
            iconName = 'book-open-page-variant';
          } else if (route.name === 'contribution') {
            IconComponent = MaterialCommunityIcons;
            iconName = 'hand-heart-outline';
          } else if (route.name === 'community') iconName = 'people-outline';

          if (focused) {
            return (
              <View style={styles.floatingIcon}>
                <IconComponent name={iconName} size={20} color="#fff" />
              </View>
            );
          }

          return <IconComponent name={iconName} size={20} color={color} />;
        },
      })}
    >
      {/* Hide tab bar on these screens */}
      {['getstarted', 'login', 'register'].map((screen) => (
        <Tabs.Screen
          key={screen}
          name={screen}
          options={{
            tabBarStyle: { display: 'none' },
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      ))}

      {/* Main Tabs */}
      <Tabs.Screen name="index1" options={{ tabBarLabel: '' }} />
      <Tabs.Screen name="bible" options={{ tabBarLabel: '' }} />
      <Tabs.Screen name="contribution" options={{ tabBarLabel: '' }} />
      <Tabs.Screen name="community" options={{ tabBarLabel: '' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#FFF3D4', // subtle gold shade
    height: 70,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 6,
    borderTopWidth: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 0,
  },
  floatingIcon: {
    backgroundColor: '#FFA500', // main orange
    padding: 12,
    borderRadius: 30,
    marginBottom: 30, // push it up
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
});
