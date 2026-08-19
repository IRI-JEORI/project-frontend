import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/Button';
import TextField from '../../../components/TextField';
import { colors, spacing } from '../../../theme/tokens';

export interface LoginFormProps {
  onLoginPress?: () => void;
}

const LoginForm = ({ onLoginPress }: LoginFormProps) => {
  return (
    <View style={styles.card}>
      <TextField label="Email" placeholder="Value" />
      <TextField label="비밀번호" placeholder="Value" secureTextEntry />
      <Button label="로그인" onPress={onLoginPress} />
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>비밀번호를 잊어버렸나요?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: spacing.formGap,
    gap: spacing.formGap,
  },
  forgotPassword: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textDefault,
  },
});

export default LoginForm;
