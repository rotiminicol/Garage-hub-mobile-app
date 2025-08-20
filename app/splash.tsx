import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Single twinkling star using Animated.Text
const Star = ({
  x,
  y,
  size,
  delay,
  duration,
}: { x: number; y: number; size: number; delay: number; duration: number }) => {
  const twinkle = useSharedValue(0);

  useEffect(() => {
    twinkle.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration }), -1, true)
    );
  }, []);

  const starStyle = useAnimatedStyle(() => {
    const scale = 0.9 + 0.2 * twinkle.value;
    const opacity = 0.25 + 0.75 * twinkle.value;
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.Text
      style={[styles.star, starStyle, { left: x, top: y, fontSize: size }]}
    >
      ✦
    </Animated.Text>
  );
};

// Layer of stars aligned in a structured pattern
const StarsLayer = ({ count = 30 }: { count?: number }) => {
  const stars = useMemo(() => {
    const starsArray = [];
    const gridSize = Math.ceil(Math.sqrt(count));
    const cellWidth = width / gridSize;
    const cellHeight = height / gridSize;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const baseX = col * cellWidth + cellWidth / 2;
      const baseY = row * cellHeight + cellHeight / 2;
      // Add slight random offset for natural look
      const offsetX = (Math.random() - 0.5) * cellWidth * 0.4;
      const offsetY = (Math.random() - 0.5) * cellHeight * 0.4;
      starsArray.push({
        x: baseX + offsetX,
        y: baseY + offsetY,
        size: 6 + Math.random() * 4, // Smaller range for consistency
        delay: Math.floor(Math.random() * 1000),
        duration: 1200 + Math.floor(Math.random() * 1000),
      });
    }
    return starsArray;
  }, [count]);

  return (
    <View style={styles.starsWrap} pointerEvents="none">
      {stars.map((s, i) => (
        <Star key={i} {...s} />
      ))}
    </View>
  );
};

export default function SplashScreen() {
  // Curtain animation shared values
  const leftCurtainX = useSharedValue(0);
  const rightCurtainX = useSharedValue(0);

  // Logo shared values
  const logoScale = useSharedValue(0.7);
  const logoOpacity = useSharedValue(0);

  // Text shared values
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(24);

  const animateAndNavigate = () => {
    router.replace('/onboarding');
  };

  useEffect(() => {
    // Curtain panels open first
    leftCurtainX.value = withDelay(200, withTiming(-width / 2, { duration: 900 }));
    rightCurtainX.value = withDelay(200, withTiming(width / 2, { duration: 900 }));

    // Logo fades & scales in after curtain opens
    logoOpacity.value = withDelay(800, withTiming(1, { duration: 700 }));
    logoScale.value = withDelay(
      850,
      withSequence(
        withSpring(1.1, { damping: 10, stiffness: 180 }),
        withSpring(1, { damping: 14, stiffness: 180 })
      )
    );

    // Text appears with slight upward movement
    textOpacity.value = withDelay(1550, withTiming(1, { duration: 600 }));
    textTranslateY.value = withDelay(1550, withSpring(0, { damping: 14, stiffness: 120 }));

    // Navigate after ~4 seconds total
    setTimeout(() => {
      runOnJS(animateAndNavigate)();
    }, 4000);
  }, []);

  // Animated styles
  const leftCurtainStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftCurtainX.value }],
  }));

  const rightCurtainStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightCurtainX.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <View style={styles.fill}>
      {/* Two animated "curtains" (pure black) */}
      <Animated.View style={[styles.curtain, styles.leftCurtain, leftCurtainStyle]} />
      <Animated.View style={[styles.curtain, styles.rightCurtain, rightCurtainStyle]} />

      {/* Animated star field behind content */}
      <StarsLayer />

      {/* Content revealed by curtain opening */}
      <View style={styles.centerContent}>
        <Animated.View style={[styles.logoWrap, logoStyle]}>
          <Image source={require('../assets/house.png')} style={{ width: 110, height: 110 }} resizeMode="contain" />
        </Animated.View>
        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.brandName}>GarageHub</Text>
          <View style={styles.taglineWrap}>
            <View style={styles.taglineLine} />
            <Text style={styles.tagline}>PREMIUM STORAGE MARKETPLACE</Text>
            <View style={styles.taglineLine} />
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  curtain: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width / 2 + 2, // overlap slightly in the middle
    backgroundColor: '#000',
    zIndex: 10,
    shadowColor: '#E0E0E0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 14,
  },
  leftCurtain: {
    left: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 32,
  },
  rightCurtain: {
    right: 0,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 32,
  },
  starsWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  star: {
    position: 'absolute',
    color: '#111111',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logoWrap: {
    marginBottom: 34,
    backgroundColor: 'transparent',
  },
  textBlock: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 42,
    fontWeight: '800',
    color: '#151515',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -1.4,
  },
  taglineWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  taglineLine: {
    width: 26,
    height: 1,
    backgroundColor: 'rgba(180,180,180,0.22)',
    borderRadius: 1,
  },
  tagline: {
    fontSize: 12,
    color: '#969696',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 2.1,
  },
});