import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../../components/Button';
import TextField from '../../../components/TextField';
import { colors, spacing } from '../../../theme/tokens';
import type { User } from '../../../api/types';

export interface LoginFormProps {
  accounts: User[];
  selectedAccountId: number | null;
  isLoadingAccounts: boolean;
  accountError: string | null;
  isLoggingIn: boolean;
  onSelectAccount: (accountId: number) => void;
  onRetryAccounts: () => void;
  onLoginPress?: () => void;
}

const LoginForm = ({
  accounts,
  selectedAccountId,
  isLoadingAccounts,
  accountError,
  isLoggingIn,
  onSelectAccount,
  onRetryAccounts,
  onLoginPress,
}: LoginFormProps) => {
  const canLogin = selectedAccountId !== null && !isLoadingAccounts && !isLoggingIn;

  return (
    <View style={styles.card}>
      <Text style={styles.accountLabel}>데모 계정</Text>
      {isLoadingAccounts ? (
        <Text style={styles.accountStatus}>계정을 불러오는 중이에요.</Text>
      ) : accountError ? (
        <TouchableOpacity onPress={onRetryAccounts} accessibilityLabel="demo-account-retry">
          <Text style={styles.accountError}>{accountError} 다시 시도</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.accountList}>
          {accounts.map(account => {
            const selected = account.id === selectedAccountId;
            return (
              <TouchableOpacity
                key={account.id}
                accessibilityLabel={`demo-account-${account.id}`}
                accessibilityState={{ selected }}
                style={[styles.accountChip, selected && styles.accountChipSelected]}
                onPress={() => onSelectAccount(account.id)}
              >
                <Text style={[styles.accountName, selected && styles.accountNameSelected]}>
                  {account.nickname}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <TextField label="Email" placeholder="Value" />
      <TextField label="비밀번호" placeholder="Value" secureTextEntry />
      <View style={!canLogin && styles.loginDisabled}>
        <Button
          label={isLoggingIn ? '로그인 중...' : '로그인'}
          onPress={canLogin ? onLoginPress : undefined}
        />
      </View>
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
    fontFamily: 'PretendardMedium',
    color: colors.textDefault,
  },
  accountLabel: {
    fontSize: 14,
    fontFamily: 'PretendardSemiBold',
    color: colors.textDefault,
  },
  accountStatus: {
    fontSize: 13,
    fontFamily: 'PretendardMedium',
    color: colors.grayText,
  },
  accountError: {
    fontSize: 13,
    fontFamily: 'PretendardMedium',
    color: colors.red,
  },
  accountList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accountChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  accountChipSelected: {
    backgroundColor: colors.charcoal,
    borderColor: colors.charcoal,
  },
  accountName: {
    fontSize: 13,
    fontFamily: 'PretendardMedium',
    color: colors.textDefault,
  },
  accountNameSelected: {
    color: colors.white,
  },
  loginDisabled: {
    opacity: 0.45,
  },
});

export default LoginForm;
