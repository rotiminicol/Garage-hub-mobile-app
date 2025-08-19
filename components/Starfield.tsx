import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { useSharedValue, withTiming, withRepeat, useAnimatedStyle } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

type Star = {
  x: number;
  y: number;
  size: number;
  delay: number;
};

export default function Starfield({
  starCount = 80,
  minSize = 1,
  maxSize = 2.2,
}: {
  starCount?: number;
  minSize?: number;
  maxSize?: number;
}) {
  const stars: Star[] = useMemo(() => {
    return new Array(starCount).fill(0).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (maxSize - minSize) + minSize,
      delay: Math.random() * 1500,
    }));
  }, [starCount, minSize, maxSize]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {stars.map((star, index) => (
        <Star key={index} x={star.x} y={star.y} size={star.size} delay={star.delay} />
      ))}
    </View>
  );
}

function Star({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
  const opacity = useSharedValue(0.2 + Math.random() * 0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 1600 + Math.random() * 1400 }),
      -1,
      true
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.star,
        style,
        {
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
});


