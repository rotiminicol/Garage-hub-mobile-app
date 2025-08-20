import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { router } from 'expo-router';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { signup } from '@/services/auth';
import Logo from '@/components/Logo';

// Import social media icons
const GoogleIcon = require('../../assets/google.png');
const FacebookIcon = require('../../assets/facebook.png');
const AppleIcon = require('../../assets/apple-logo.png');

const InputField = React.memo(({ 
  icon: Icon, 
  label,
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry = false,
  showPasswordToggle = false,
  isPasswordVisible = false,
  onTogglePassword,
  inputRef,
  ...props 
}: any) => (
  <View style={styles.inputField}>
    {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
    <View style={styles.inputContainer}>
      <View style={styles.inputIcon}>
        <Icon size={20} color="#6b7280" />
      </View>
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        selectionColor="#111111"
        autoCorrect={false}
        {...props}
      />
      {showPasswordToggle && (
        <TouchableOpacity style={styles.passwordToggle} onPress={onTogglePassword}>
          {isPasswordVisible ? (
            <EyeOff size={20} color="#6b7280" />
          ) : (
            <Eye size={20} color="#6b7280" />
          )}
        </TouchableOpacity>
      )}
    </View>
  </View>
));

export default function SignUpScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasAgreed, setHasAgreed] = useState(false);
  const nameRef = useRef<TextInput | null>(null);
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmRef = useRef<TextInput | null>(null);

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

  const handleSignUp = async () => {
    if (!isFormValid) return;
    try {
      setErrorMessage(null);
      setIsLoading(true);
      await signup({ name: formData.name.trim(), full_name: formData.name.trim(), email: formData.email.trim(), password: formData.password } as any);
      router.push({ pathname: '/auth/verify-otp', params: { email: formData.email.trim() } as any });
    } catch (error: any) {
      const data = error?.response?.data;
      const message = (data && (data.message || data.error)) || error?.message || 'Signup failed';
      setErrorMessage(message);
      Alert.alert('Sign up failed', message);
    } finally {
      setIsLoading(false);
    }
  };

  
  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.password.trim().length >= 6 &&
    formData.password === formData.confirmPassword &&
    hasAgreed;

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <ScrollView contentContainerStyle={styles.scrollInner} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {/* Header with Back Button and Logo */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ArrowLeft size={24} color="#111111" />
              </TouchableOpacity>
              <View style={styles.logo}>
                <Logo size={40} />
              </View>
              <View style={styles.placeholderView} /> {/* Empty view for balance */}
            </View>

            <Text style={styles.title}>Create your account</Text>

            <View style={styles.form}>
              <InputField
                icon={User}
                label="Full name"
                placeholder="Full name"
                value={formData.name}
                onChangeText={(text: string) => setFormData(prev => ({ ...prev, name: text }))}
                autoCapitalize="words"
                returnKeyType="next"
                inputRef={nameRef}
                onSubmitEditing={() => emailRef.current?.focus()}
              />

              <InputField
                icon={Mail}
                label="Email"
                placeholder="Email"
                value={formData.email}
                onChangeText={(text: string) => setFormData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                returnKeyType="next"
                inputRef={emailRef}
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <InputField
                icon={Lock}
                label="Password"
                placeholder="Password"
                value={formData.password}
                onChangeText={(text: string) => setFormData(prev => ({ ...prev, password: text }))}
                secureTextEntry
                showPasswordToggle
                isPasswordVisible={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                autoComplete="password"
                textContentType="newPassword"
                returnKeyType="next"
                inputRef={passwordRef}
                onSubmitEditing={() => confirmRef.current?.focus()}
              />

              <InputField
                icon={Lock}
                label="Confirm password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChangeText={(text: string) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                secureTextEntry
                showPasswordToggle
                isPasswordVisible={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                textContentType="password"
                returnKeyType="done"
                inputRef={confirmRef}
                onSubmitEditing={() => {}}
              />

              <TouchableOpacity style={styles.agreeRow} onPress={() => setHasAgreed(!hasAgreed)}>
                <View style={[styles.checkbox, hasAgreed && styles.checkboxChecked]}>
                  {hasAgreed && <Text style={styles.checkboxMark}>✓</Text>}
                </View>
                <Text style={styles.agreeText}>I understand the <Text style={styles.linkText}>terms & policy</Text>.</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.primaryButton, (!isFormValid || isLoading) && styles.primaryButtonDisabled]} onPress={handleSignUp} disabled={!isFormValid || isLoading}>
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Creating Account...' : 'SIGN UP'}
                </Text>
              </TouchableOpacity>

              {errorMessage ? (
                <Text style={styles.errorText}>{errorMessage}</Text>
              ) : null}

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialRow}>
                <TouchableOpacity style={styles.socialIconButton}>
                  <Image source={GoogleIcon} style={styles.socialIcon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconButton}>
                  <Image source={FacebookIcon} style={styles.socialIcon} resizeMode="contain" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialIconButton}>
                  <Image source={AppleIcon} style={styles.socialIcon} resizeMode="contain" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/auth/login')}>
              <Text style={styles.loginText}>
                Have an account? <Text style={styles.loginHighlight}>SIGN IN</Text>
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
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
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  scrollInner: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderView: {
    width: 40, // Same as back button for balance
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 18,
  },
  inputField: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
    marginLeft: 2,
    fontWeight: '600',
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
  passwordToggle: {
    padding: 4,
  },
  agreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#111111',
  },
  checkboxMark: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 14,
  },
  agreeText: {
    color: '#6b7280',
    fontSize: 14,
    flex: 1,
  },
  linkText: {
    color: '#111111',
    textDecorationLine: 'underline',
    fontWeight: '800',
  },
  primaryButton: {
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: '#111111',
    alignItems: 'center',
    paddingVertical: 14,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
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
});