import React, { useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Starfield from '@/components/Starfield';
import { router } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: 'passive-income',
    title: 'Earn Effortlessly',
    description: 'Monetize your unused garage and get paid monthly. Host on your terms, fully flexible.',
    icon: (
      <Svg width={52} height={52} viewBox="0 0 24 24" stroke="#FFF" fill="none" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 18v-6.3c0-.42.19-.82.52-1.1l7-6.3c.57-.51 1.41-.51 1.98 0l7 6.3c.33.29.52.69.52 1.1V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
        <Path d="M9 22V12h6v10"/>
      </Svg>
    ),
  },
  {
    key: 'total-protection',
    title: 'Total Protection',
    description: 'Bookings are covered by $1M insurance and secure identity verification. Peace of mind every host.',
    icon: (
      <Svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </Svg>
    ),
  },
  {
    key: 'smart-management',
    title: 'Smart Management',
    description: 'Easy to manage, book and pay—all from our app. Let AI handle pricing, instant bookings, more.',
    icon: (
      <Svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M7 20h10M9 16V8a3 3 0 1 1 6 0v8" />
        <Path d="M5 9v6a7 7 0 0 0 14 0V9"/>
      </Svg>
    ),
  },
];

export default function ModernWelcomeSlider() {
  const slideIndex = useSharedValue(0);
  const fadeAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(0.92);

  useEffect(() => {
    fadeAnim.value = withTiming(1, { duration: 800 });
    scaleAnim.value = withTiming(1, { duration: 1100 });

    // Optionally animate between slides in the future
  }, []);

  // Slider animation
  const sliderStyle = useAnimatedStyle(() => ({
    width: width * SLIDES.length,
    flexDirection: 'row',
    transform: [{ translateX: -slideIndex.value * width }],
  }));

  const fadeInStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
    transform: [{ scale: scaleAnim.value }],
  }));

  // Tap-to-swipe for demo purposes, or auto-advance
  // Could add an effect to cycle slides if you'd like - easy mod

  // Navigation actions
  const handleSignUp = useCallback(() => {
    router.push('/auth/signup');
  }, []);
  const handleSignIn = useCallback(() => {
    router.push('/auth/login');
  }, []);

  // Dots tap: let user tap any dot to jump to the slide
  const handleDotPress = (i: number) => {
    slideIndex.value = withTiming(i, { duration: 600 });
  };

  return (
    <View style={styles.root}>
      <View style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, backgroundColor: '#000' }} />
        <Starfield starCount={120} />
      </View>

      {/* Logo and App Name */}
      <Animated.View style={[styles.logoSection, fadeInStyle]}>
        <Image source={require('../assets/house.png')} style={{ width: 52, height: 52 }} resizeMode="contain" />
        <Text style={styles.brandName}>GarageHub</Text>
      </Animated.View>

      {/* BIG space between logo and the slider */}
      <View style={styles.logoSpace} />

      {/* Slides */}
      <Animated.View style={[styles.sliderWrap, fadeInStyle]}>
        <Animated.View style={sliderStyle}>
          {SLIDES.map((slide, i) => (
            <View key={slide.key} style={[styles.slide, { width }]}>
              <View style={styles.iconWrap}>{slide.icon}</View>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideDesc}>{slide.description}</Text>
            </View>
          ))}
        </Animated.View>
      </Animated.View>

      {/* Another space between slider and footer */}
      <View style={styles.sliderSpace} />

      {/* Pagination and Controls */}
      <Animated.View style={[styles.footerSection, fadeInStyle]}>
        <View style={styles.dotsRow}>
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => handleDotPress(i)}
              style={[
                styles.dot,
                slideIndex.value === i
                  ? { backgroundColor: '#FFF', width: 19 }
                  : { backgroundColor: '#4B5563' },
              ]}
              activeOpacity={0.8}
            />
          ))}
        </View>
        {/* Main CTA and Sign In */}
        <TouchableOpacity
          onPress={handleSignUp}
          style={styles.getStartedBtn}
          activeOpacity={0.96}
        >
          <Text style={styles.getStartedTxt}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignIn} style={styles.signInRow} activeOpacity={0.8}>
          <Text style={styles.signInLight}>Already have an account?</Text>
          <Text style={styles.signInDark}>Sign In</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  logoSection: {
    marginTop: 60,
    alignItems: 'center',
    marginBottom: 0,
    zIndex: 10,
  },
  logoSpace: {
    height: 55, // Plenty of space between logo and slider
  },
  brandName: {
    fontWeight: '900',
    fontSize: 30,
    color: '#FFF',
    letterSpacing: -1.1,
    marginTop: 9,
  },
  sliderWrap: {
    flexGrow: 0,
    height: 300,
    marginBottom: 0,
    alignSelf: 'stretch',
    overflow: 'visible',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
    paddingBottom: 0,
    marginBottom: 0,
  },
  iconWrap: {
    marginBottom: 33,
  },
  slideTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 13,
    letterSpacing: -1,
  },
  slideDesc: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 23,
    fontWeight: Platform.OS === 'ios' ? '600' : '500',
    marginHorizontal: 7,
    opacity: 0.83,
  },
  sliderSpace: {
    height: 54, // Generous space before footer/controls
  },
  footerSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom: 36,
    paddingHorizontal: 28,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 30,
    marginTop: 7,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 7,
    marginHorizontal: 1,
    backgroundColor: '#4B5563',
    transition: 'width 200ms',
  },
  getStartedBtn: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 38,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
    marginTop: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  getStartedTxt: {
    color: '#000',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 1,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
  },
  signInLight: {
    color: '#E5E7EB',
    fontSize: 14,
    marginRight: 7,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  signInDark: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.3,
    textDecorationLine: 'underline'
  },
});