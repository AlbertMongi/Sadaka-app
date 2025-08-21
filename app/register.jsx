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

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [buttonOpacity] = React.useState(new Animated.Value(1));

  const handleRegister = () => {
    // No password validation now
    Alert.alert('Success', 'Your account has been created!');
    console.log('Registered:', { fullName, phoneNumber });

    // Redirect after registration
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the Sadaka Community</Text>
      </View>

      {/* Form Inputs */}
      <View style={styles.form}>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#FFA54F"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="#FFA54F"
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        {/* Register Button */}
        <Animated.View style={{ width: '80%', opacity: buttonOpacity }}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.button,
              { backgroundColor: fullName && phoneNumber ? '#FF8C00' : '#e0c8a3' },
            ]}
            disabled={!(fullName && phoneNumber)}
            onPress={handleRegister}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Text style={styles.buttonText}>Register</Text>
            <Ionicons name="person-add-outline" size={18} color="#fff" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </Animated.View>

        {/* Login Link */}
        <TouchableOpacity onPress={() => router.push('main/index1')}>
          <Text style={styles.loginLink}>
            Already have an account? <Text>Login</Text>
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
  loginLink: {
    color: '#FF8C00',
    fontSize: 13,
    textAlign: 'center',
  },
});
