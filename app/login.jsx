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

const API_BASE_URL = 'http://192.168.100.24:8000';

export default function Login() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  // Removed password state and related logic
  const [buttonOpacity] = React.useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    if (!phoneNumber) {
      setErrorMessage('Please enter phone number.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNo: phoneNumber,
          // Password removed from request
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'You are logged in!');
        console.log('Logged in:', data);
        router.push('otp'); // navigate on success
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Network error. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
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
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#FFA54F"
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          editable={!loading}
        />

        {/* Login Button */}
        <Animated.View style={{ width: '80%', opacity: buttonOpacity }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.button,
              { backgroundColor: phoneNumber ? '#FF8C00' : '#e0c8a3' },
            ]}
            disabled={!phoneNumber || loading}
            onPress={handleLogin}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Logging in...' : 'Login'}
            </Text>
            {!loading && (
              <Ionicons
                name="log-in-outline"
                size={18}
                color="#fff"
                style={{ marginLeft: 6 }}
              />
            )}
          </TouchableOpacity>
        </Animated.View>

        {/* Register Link */}
        <TouchableOpacity onPress={() => router.push('register')}>
          <Text style={styles.registerLink}>
            Don't have an account? <Text style={{ color: '#FF8C00' }}>Register</Text>
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
  errorText: {
    color: '#FF8C00',
    marginBottom: 10,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});
