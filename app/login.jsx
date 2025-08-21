import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [buttonOpacity] = React.useState(new Animated.Value(1));

  const handleLogin = () => {
    Alert.alert('Success', 'You are logged in!');
    console.log('Logged in:', { phoneNumber });

    // Redirect after login
    router.push('index1');
  };

  const onPressIn = () => {
    Animated.timing(buttonOpacity, {
      toValue: 0.7,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please log in to continue</Text>
      </View>

      {/* Form Inputs */}
      <View style={styles.form}>
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#FFA54F"
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Login Button */}
        <Animated.View style={{ width: '80%', opacity: buttonOpacity }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.button,
              { backgroundColor: phoneNumber ? '#FF8C00' : '#e0c8a3' },
            ]}
            disabled={!phoneNumber}
            onPress={handleLogin}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={styles.buttonText}>Login</Text>
            <Ionicons name="log-in-outline" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </Animated.View>

        {/* Register Link */}
        <TouchableOpacity onPress={() => router.push('register')}>
          <Text style={styles.registerLink}>
            Don't have an account? <Text style={{color: '#FF8C00'}}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  form: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 42,
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#333',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  registerLink: {
    color: '#FF8C00',
    fontSize: 13,
    textAlign: 'center',
  },
});
