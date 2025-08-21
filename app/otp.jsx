import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Keyboard,
} from 'react-native';

export default function OTPVerification() {
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const inputs = useRef([]);

  // Handle text change in each OTP box
  const handleChangeText = (text, index) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to next input if text entered and not last input
      if (text && index < OTP_LENGTH - 1) {
        inputs.current[index + 1].focus();
      }

      // Move to previous input if text cleared
      if (!text && index > 0) {
        inputs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === OTP_LENGTH) {
      Alert.alert('OTP Verified', `You entered: ${enteredOtp}`);
      // Add your verification logic here
    } else {
      Alert.alert('Invalid OTP', 'Please enter the full OTP.');
    }
  };

  const handleResend = () => {
    Alert.alert('OTP Resent', 'A new OTP has been sent to your phone.');
    // Add your resend OTP logic here
  };

  return (
    <SafeAreaView style={styles.container} onTouchStart={Keyboard.dismiss}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Please enter the 6-digit code sent to your phone</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={el => (inputs.current[index] = el)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={text => handleChangeText(text, index)}
            returnKeyType="done"
            textAlign="center"
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[
          styles.verifyButton,
          { backgroundColor: otp.every(d => d !== '') ? '#FF8C00' : '#e0c8a3' },
        ]}
        disabled={!otp.every(d => d !== '')}
        onPress={handleVerify}
      >
        <Text style={styles.verifyButtonText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleResend}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 32,
  },
  otpInput: {
    width: 40,
    height: 50,
    borderWidth: 1,
    borderColor: '#FF8C00',
    borderRadius: 8,
    fontSize: 24,
    color: '#333',
  },
  verifyButton: {
    width: '80%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendText: {
    color: '#FF8C00',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
