import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { router } from 'expo-router';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
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

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }, 2000);
  };

  
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
        <ScrollView contentContainerStyle={styles.scrollInner} keyboardShouldPersistTaps="handled">
          <Animated.View style={[styles.content, animatedStyle]}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft size={24} color="#111111" />
            </TouchableOpacity>
            
            <View style={styles.header}>
              <View style={styles.logo}> 
                <Logo size={40} />
              </View>
              <Text style={styles.title}>Sign in your account</Text>
            </View>

            <View style={styles.form}>
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
                blurOnSubmit={false}
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
                textContentType="password"
                returnKeyType="done"
                inputRef={passwordRef}
                onSubmitEditing={handleLogin}
              />

              <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/auth/forgot')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'SIGN IN'}
                </Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign in with</Text>
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

            <TouchableOpacity style={styles.signUpLink} onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signUpText}>
                Don't have an account? <Text style={styles.signUpHighlight}>SIGN UP</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: 10,
  },
  scrollInner: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
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
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#111111',
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
  loginButton: {
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: '#111111',
    alignItems: 'center',
    paddingVertical: 14,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
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
  signUpLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: '#6b7280',
  },
  signUpHighlight: {
    color: '#111111',
    fontWeight: '800',
    textDecorationLine: 'underline'
  },
});