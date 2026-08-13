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
}

const Button = ({ label, onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.label}>{label}</Text>
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
  label: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Button;
