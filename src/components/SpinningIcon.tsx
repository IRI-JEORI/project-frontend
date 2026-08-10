import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

export const SpinningIcon = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <Svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        {/* A generic yellow icon (like a sun or face) since we don't have the exact svg paths */}
        <Circle cx="24" cy="24" r="20" fill="#FFE255" />
        <Circle cx="16" cy="20" r="2" fill="#483B35" />
        <Circle cx="32" cy="20" r="2" fill="#483B35" />
        <Path d="M 16 30 Q 24 38 32 30" stroke="#483B35" strokeWidth="3" strokeLinecap="round" />
      </Svg>
    </Animated.View>
  );
};
