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
  disabled?: boolean;
  size?: 'large' | 'medium';
  variant?: 'primary' | 'secondary';
}

const Button = ({
  label,
  onPress,
  disabled = false,
  size = 'large',
  variant = 'primary',
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        size === 'medium' && styles.buttonMedium,
        variant === 'secondary' && styles.buttonSecondary,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.label,
          size === 'medium' && styles.labelMedium,
          variant === 'secondary' && styles.labelSecondary,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.charcoal,
    borderRadius: 8,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonMedium: {
    height: 40,
  },
  buttonSecondary: {
    backgroundColor: colors.folderGray,
  },
  label: {
    color: colors.bannerBg,
    fontSize: 18,
    fontFamily: 'PretendardSemiBold',
  },
  labelMedium: {
    fontSize: 13,
  },
  labelSecondary: {
    color: colors.black,
  },
});

export default Button;
