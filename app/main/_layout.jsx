import { Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, View, Text } from 'react-native';

export default function Layout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#6B4F4F',
        tabBarStyle: styles.bottomNav,
        tabBarItemStyle: styles.navItem,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: { fontSize: 0 }, // hides default label
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          let label;
          let IconComponent = Ionicons;

          if (route.name === 'index1') {
            iconName = 'home-outline';
            label = 'Home';
          } else if (route.name === 'bible') {
            IconComponent = MaterialCommunityIcons;
            iconName = 'calendar';
            label = 'Events';
          } else if (route.name === 'contribution') {
            IconComponent = MaterialCommunityIcons;
            iconName = 'hand-heart-outline';
            label = 'Give';
          } else if (route.name === 'community') {
            IconComponent = MaterialCommunityIcons;
            iconName = 'account-group-outline';
            label = 'Communities';
          }

          return (
            <View style={{ alignItems: 'center' }}>
              {focused ? (
                <View style={styles.floatingIcon}>
                  <IconComponent name={iconName} size={18} color="#fff" />
                </View>
              ) : (
                <IconComponent name={iconName} size={18} color={color} />
              )}
              <Text style={focused ? styles.activeLabel : styles.inactiveLabel}>
                {label}
              </Text>
            </View>
          );
        },
      })}
    >
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

      <Tabs.Screen name="index1" />
      <Tabs.Screen name="bible" />
      <Tabs.Screen name="contribution" />
      <Tabs.Screen name="community" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    backgroundColor: '#FFF3D4',
    height: 62, // slightly reduced
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 5,
    elevation: 5,
    borderTopWidth: 0,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
  },
  activeLabel: {
    fontSize: 11,
    color: '#FFA500',
    marginTop: 2,
    fontWeight: '600',
  },
  inactiveLabel: {
    fontSize: 10,
    color: '#6B4F4F',
    marginTop: 2,
  },
  floatingIcon: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 25,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
  },
});
