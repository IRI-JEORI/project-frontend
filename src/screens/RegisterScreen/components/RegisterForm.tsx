import React from 'react';
import { StyleSheet, View } from 'react-native';
import Button from '../../../components/Button';
import TextField from '../../../components/TextField';
import { colors, spacing } from '../../../theme/tokens';

const RegisterForm = () => {
  return (
    <View style={styles.card}>
      <TextField label="닉네임" placeholder="Value" />
      <TextField label="Email" placeholder="Value" />
      <TextField label="비밀번호" placeholder="Value" secureTextEntry />
      <TextField label="비밀번호 확인" placeholder="Value" secureTextEntry />
      <Button label="등록" />
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
});

export default RegisterForm;
