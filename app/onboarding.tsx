import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

type Slide = {
  id: number;
  title: string;
  subtitle: string;
  image: any;
};

const slides: Slide[] = [
  {
    id: 1,
    title: 'Welcome to GarageHub',
    subtitle: "You're now part of our incredible community. Let's get started!",
    image: require('../assets/bus-school.png'),
  },
  {
    id: 2,
    title: 'Discover Spaces',
    subtitle: 'Find secure storage near you and learn something new every week.',
    image: require('../assets/location.png'),
  },
  {
    id: 3,
    title: 'Nearby Options',
    subtitle: 'Connect with trusted hosts in your city. Add your items and get started.',
    image: require('../assets/location2.png'),
  },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const goNext = () => {
    if (index < slides.length - 1) {
      const next = index + 1;
      setIndex(next);
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
    } else {
      router.replace('/auth/signup');
    }
  };

  const skip = () => router.replace('/(tabs)/home');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
      >
        {slides.map((s) => (
          <View key={s.id} style={styles.slide}>
            <View style={styles.illustration}>
              <Image source={s.image} style={styles.illustrationImage} resizeMode="contain" />
            </View>

            <View style={styles.textBlock}>
              <Text style={styles.title}>{s.title}</Text>
              <Text style={styles.subtitle}>{s.subtitle}</Text>
            </View>

            <View style={styles.bottomBlock}>
              {/* Dots */}
              <View style={styles.dotsRow}>
                {slides.map((_, di) => (
                  <View key={di} style={[styles.dot, di === index ? styles.dotActive : undefined]} />
                ))}
              </View>

              {/* Buttons */}
              {index < slides.length - 1 ? (
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.outlineBtn} onPress={skip}>
                    <Text style={styles.outlineText}>Skip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.solidBtn} onPress={goNext}>
                    <Text style={styles.solidText}>Next</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.fullWidthBtn} onPress={goNext}>
                  <Text style={styles.solidText}>Let's Get Started</Text>
                </TouchableOpacity>
              )}
              
              {/* Extra bottom spacer */}
              <View style={styles.bottomSpacer} />
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  slide: {
    width,
    height: height - 30, // Reduced height to prevent overflow
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  bottomBlock: {
    width: '100%',
    marginTop: 'auto',
    paddingBottom: 5,
  },
  textBlock: {
    alignItems: 'center',
    marginBottom: 20,
    flexShrink: 1,
  },
  illustration: {
    width: '100%',
    height: height * 0.32, // Further reduced to create more space
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  illustrationImage: {
    width: '80%',
    height: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 25,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  dotActive: {
    width: 20,
    backgroundColor: '#111111',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 15, // Added margin for more space
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineText: {
    color: '#111111',
    fontWeight: '700',
    fontSize: 16,
  },
  solidBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  fullWidthBtn: {
    width: '100%',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#111111',
    marginBottom: 15, // Added margin for more space
  },
  solidText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 25, // Added extra space at the bottom
  },
});