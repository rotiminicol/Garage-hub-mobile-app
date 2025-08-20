import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { router, useNavigation } from 'expo-router';
import { Mail, ArrowLeft } from 'lucide-react-native';
import Logo from '@/components/Logo';
import { requestPasswordReset } from '@/services/auth';
import { useUI } from '@/contexts/UIProvider';

export default function ForgotPasswordScreen() {
  const navigation: any = useNavigation();
  const ui = useUI();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

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

  const handleResetPassword = async () => {
    if (!email.trim()) return;
    try {
      setIsLoading(true);
      ui.showLoader('Sending Instructions...');
      const res = await requestPasswordReset(email.trim());
      setIsEmailSent(res.ok);
      if (!res.ok) ui.showError('Could not send reset instructions.', 'Reset failed');
    } catch (e) {
      setIsEmailSent(false);
      ui.showError('Could not send reset instructions.', 'Reset failed');
    } finally {
      setIsLoading(false);
      ui.hideLoader();
    }
  };

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      router.replace('/auth/login');
    }
  };

  if (isEmailSent) {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successEmoji}>📧</Text>
            </View>
            
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent password reset instructions to{'\n'}
              <Text style={styles.emailHighlight}>{email}</Text>
            </Text>
            
            <TouchableOpacity style={styles.resetButton} onPress={() => router.push('/auth/login')}>
              <Text style={styles.resetButtonText}>BACK TO SIGN IN</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.resendButton} onPress={() => setIsEmailSent(false)}>
              <Text style={styles.resendText}>Didn't receive the email? Resend</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    );
  }

  const emailRef = useRef<TextInput | null>(null);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
        <ScrollView contentContainerStyle={styles.scrollInner} keyboardShouldPersistTaps="handled">
        <Animated.View style={[styles.content, animatedStyle]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={24} color="#111111" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Logo size={40} />
            </View>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <View style={styles.inputIcon}>
                <Mail size={20} color="#6b7280" />
              </View>
              <TextInput
                ref={emailRef}
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={(t: string) => setEmail(t)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                selectionColor="#111111"
                autoCorrect={false}
                returnKeyType="send"
                onSubmitEditing={handleResetPassword}
              />
            </View>

            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={handleResetPassword} 
              disabled={isLoading || !email.trim()}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Sending Instructions...' : 'SEND RESET INSTRUCTIONS'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/auth/login')}>
            <Text style={styles.loginText}>
              Remember your password? <Text style={styles.loginHighlight}>SIGN IN</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  scrollInner: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  form: {
    gap: 18,
    marginBottom: 24, // Added space below the form
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 14,
  },
  resetButton: {
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
    paddingVertical: 14,
  },
  disabledButton: {
    opacity: 0.5,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginHighlight: {
    color: '#111111',
    fontWeight: '800',
    textDecorationLine: 'underline'
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIcon: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  successEmoji: {
    fontSize: 48,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  emailHighlight: {
    color: '#fbbf24',
    fontWeight: '600',
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resendButton: {
    paddingVertical: 12,
  },
  resendText: {
    fontSize: 14,
    color: '#fbbf24',
    fontWeight: '600',
  },
});