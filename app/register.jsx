import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Handle registration logic here
    console.log('Full Name:', fullName, 'Phone:', phoneNumber, 'Password:', password);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
      style={styles.container}
    >
      <View style={styles.overlay} />

      <View style={styles.topTextContainer}>
        <Text style={styles.welcomeText}>CREATE AN ACCOUNT</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="rgba(255,215,0,0.7)"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="rgba(255,215,0,0.7)"
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="rgba(255,215,0,0.7)"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="rgba(255,215,0,0.7)"
          secureTextEntry
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/index1')}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  topTextContainer: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 30 },
  welcomeText: {
    color: 'gold',
    fontSize: 22,
    fontFamily: 'Cursive',
    textAlign: 'center',
    textShadowColor: '#00000088',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  formContainer: { width: '85%', alignItems: 'center' },
  input: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'gold',
    marginBottom: 18,
    color: 'gold',
    fontSize: 14,
    fontFamily: 'Cursive',
    backgroundColor: 'rgba(255,215,0,0.1)',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'gold',
    marginBottom: 12,
  },
  buttonText: { color: 'gold', fontSize: 16, fontFamily: 'Cursive', fontWeight: 'bold', textAlign: 'center' },
  loginText: { color: 'gold', fontSize: 12, fontFamily: 'Cursive', textAlign: 'center', textDecorationLine: 'underline' },
});
