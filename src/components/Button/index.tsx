import React from 'react';
import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/tokens';

export interface ButtonProps {
  label: string;
  onPress?: (event: GestureResponderEvent) => void;
  size?: 'large' | 'medium';
}

const Button = ({ label, onPress, size = 'large' }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, size === 'medium' && styles.buttonMedium]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.label, size === 'medium' && styles.labelMedium]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.brown,
    borderRadius: 8,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMedium: {
    height: 40,
  },
  label: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  labelMedium: {
    fontSize: 13,
  },
});

export default Button;
