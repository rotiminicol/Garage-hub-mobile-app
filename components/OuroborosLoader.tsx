import React, { useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop, G } from 'react-native-svg';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const HouseIcon = require('../assets/house.png');

export default function OuroborosLoader({ size = 160, color = '#111111', durationMs = 1600, message }: { size?: number; color?: string; durationMs?: number; message?: string }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: durationMs, easing: Easing.linear }),
      -1,
      false
    );
  }, [durationMs]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const r = size * 0.36;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = Math.max(6, Math.floor(size * 0.06));
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * 0.78; // snake body (78% of circle)

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <View style={styles.centerLogo}>
        <Image source={HouseIcon} style={{ width: size * 0.42, height: size * 0.42 }} resizeMode="contain" />
      </View>
      <Animated.View style={[StyleSheet.absoluteFill, styles.center, spinStyle]}>
        <Svg width={size} height={size}>
          <Defs>
            <LinearGradient id="snakeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={color} stopOpacity="1" />
              <Stop offset="80%" stopColor={color} stopOpacity="0.6" />
              <Stop offset="100%" stopColor={color} stopOpacity="0.2" />
            </LinearGradient>
          </Defs>
          {/* rotate -90deg so the arc starts at top for a nicer effect */}
          <G rotation={-90} originX={cx} originY={cy}>
            <Circle
              cx={cx}
              cy={cy}
              r={r}
              stroke="url(#snakeGradient)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${arcLength}, ${circumference}`}
            />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLogo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});


