import React from 'react';
import { Image, StyleProp, ImageStyle } from 'react-native';

type LogoProps = {
  size?: number;
  style?: StyleProp<ImageStyle>;
};

export default function Logo({ size = 28, style }: LogoProps) {
  return (
    <Image
      source={require('../assets/house.png')}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
    />
  );
}
