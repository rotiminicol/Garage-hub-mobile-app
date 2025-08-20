import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import Logo from '@/components/Logo';
import { verifyOtp } from '@/services/auth';
import { useUI } from '@/contexts/UIProvider';

export default function VerifyOTPScreen() {
  const ui = useUI();
  const OTP_LENGTH = 4;
  const [code, setCode] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ''));
  const inputs = Array.from({ length: OTP_LENGTH }, () => useRef<TextInput | null>(null));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const TESTING_OTP_BYPASS = true;

  const fadeAnim = useSharedValue(0);
  const slideAnim = useSharedValue(30);

  React.useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    slideAnim.value = withTiming(0, { duration: 600 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ translateY: slideAnim.value }],
  }));

  const handleChange = (text: string, idx: number) => {
    if (/^\d?$/.test(text)) {
      const next = [...code];
      next[idx] = text;
      setCode(next);
      if (text && idx < inputs.length - 1) inputs[idx + 1].current?.focus();
      if (!text && idx > 0) inputs[idx - 1].current?.focus();
    }
  };

  const params = useLocalSearchParams<{ email?: string; user_id?: string }>();

  const handleVerify = async () => {
    const pin = code.join('');
    if (TESTING_OTP_BYPASS) {
      setErrorMessage(null);
      ui.showError('OTP bypassed for demo. Any code is accepted.', 'Testing mode');
      router.replace('/(tabs)/home');
      return;
    }
    if (pin.length !== OTP_LENGTH) return;
    try {
      setErrorMessage(null);
      const result = await verifyOtp({ otp_code: pin, email: params?.email, user_id: params?.user_id ? Number(params.user_id) : undefined });
      if (result.ok) {
        router.replace('/(tabs)/home');
      } else {
        const msg = result.reason || 'Invalid or expired code';
        setErrorMessage(msg);
        ui.showError(msg, 'Verification failed');
      }
    } catch (e) {
      setErrorMessage('OTP verification error');
      ui.showError('OTP verification error', 'Verification failed');
    }
  };

  const handleResend = () => {
    // TODO: trigger resend
  };

  const isComplete = code.every((c) => c.length === 1);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <View style={styles.header}>
            <View style={styles.logo}>
              <Logo size={40} />
            </View>
            <Text style={styles.title}>Verify your email</Text>
            <Text style={styles.subtitle}>Enter the code sent to your email address.</Text>
            <Text style={styles.testingNote}>Testing mode is ON: any code will be accepted.</Text>
          </View>

          <View style={styles.pinRow}>
            {code.map((v, i) => (
              <TextInput
                key={i}
                ref={inputs[i]}
                style={[styles.pinInput, v ? styles.pinFilled : undefined]}
                keyboardType="number-pad"
                maxLength={1}
                value={v}
                onChangeText={(t) => handleChange(t, i)}
                returnKeyType="next"
                selectionColor="#111111"
                autoCorrect={false}
              />
            ))}
          </View>

          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <TouchableOpacity style={styles.primaryButton} onPress={handleVerify}>
            <Text style={styles.primaryButtonText}>VERIFY</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendRow} onPress={handleResend}>
            <Text style={styles.resendText}>Resend code</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backToLogin} onPress={() => router.replace('/auth/login')}>
            <Text style={styles.backToLoginText}>Back to Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 56, height: 56, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 22, paddingHorizontal: 8 },
  pinRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 18 },
  pinInput: { width: 56, height: 56, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', textAlign: 'center', fontSize: 20, color: '#111827' },
  pinFilled: { borderColor: '#111111' },
  primaryButton: { borderRadius: 12, backgroundColor: '#111111', alignItems: 'center', paddingVertical: 14, marginTop: 4 },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { fontSize: 14, fontWeight: '800', color: '#ffffff', letterSpacing: 0.5 },
  resendRow: { alignItems: 'center', marginTop: 12 },
  resendText: { fontSize: 14, color: '#111111', fontWeight: '600', textDecorationLine: 'underline' },
  backToLogin: { alignItems: 'center', marginTop: 8 },
  backToLoginText: { fontSize: 14, color: '#6b7280' },
  errorText: { color: '#b91c1c', fontSize: 13, textAlign: 'center', marginBottom: 8 },
  testingNote: { fontSize: 12, color: '#6b7280', textAlign: 'center', marginTop: 6 },
});
