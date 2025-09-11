import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BASE_URL } from './apiConfig'; // ✅ Adjust path as needed

// const API_BASE_URL = `${BASE_URL}`;

export default function Login() {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [buttonOpacity] = useState(new Animated.Value(1));
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
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNo: phoneNumber }),
      });

      const data = await response.json();
      console.log('API response:', data); // ✅ Helpful for debugging

      if (response.ok) {
        // ✅ Store phone number only, since token isn't returned here
        await AsyncStorage.setItem('userPhoneNo', phoneNumber);

        // Alert.alert('Success', 'OTP sent to your phone!');
        router.push('/otp');
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error); // ✅ Debug log
      setErrorMessage('Network error. Please try again later.'+error);
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
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Please log in to continue</Text>
      </View>

      <View style={styles.form}>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#FFA54F"
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          editable={!loading}
        />

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

        <TouchableOpacity onPress={() => router.push('register')}>
          <Text style={styles.registerLink}>
            Don't have an account?{' '}
            <Text style={{ color: '#FF8C00' }}>Register</Text>
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
