import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Phone:', phone, 'Password:', password);
  };

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470' }}
      style={styles.container}
    >
      {/* Overlay */}
      <View style={styles.overlay} />

      <View style={styles.topTextContainer}>
        <Text style={styles.welcomeText}>WELCOME TO SADAKA APP</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="rgba(255,215,0,0.7)"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.registerText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 0,
  },
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
  formContainer: { width: '85%', alignItems: 'center', zIndex: 1 },
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
    backgroundColor: 'rgba(255,215,0,0.15)',
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
  registerText: {
    color: 'gold',
    fontSize: 12,
    fontFamily: 'Cursive',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});
