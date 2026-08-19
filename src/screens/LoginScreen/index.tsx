import React, { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../components/Logo';
import { colors } from '../../theme/tokens';
import { RootStackParamList } from '../../navigation/types';
import { ApiError, nunnunApi } from '../../api';
import BottomLinks from './components/BottomLinks';
import LoginForm from './components/LoginForm';

const LOGO_TOP_SPACING = 198;
const FORM_TOP_SPACING = 60;
const FORM_WIDTH = 320;
const BOTTOM_SPACING = 87;

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginPress = async () => {
    if (isLoggingIn) {
      return;
    }
    setIsLoggingIn(true);
    try {
      // 데모 로그인: 백엔드가 이메일/비밀번호 인증을 아직 지원하지 않아
      // 데모 계정 목록의 첫 번째 계정으로 로그인합니다.
      const { accounts } = await nunnunApi.auth.getDemoAccounts();
      const demoAccount = accounts[0];
      if (!demoAccount) {
        Alert.alert('로그인 실패', '사용 가능한 데모 계정이 없어요.');
        return;
      }
      await nunnunApi.auth.demoLogin(demoAccount.id);
      navigation.navigate('Home');
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : '서버에 연결할 수 없어요. 백엔드 서버가 켜져 있는지 확인해주세요.';
      Alert.alert('로그인 실패', message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <Logo color={colors.brownDarkest} />
      <View style={styles.form}>
        <LoginForm onLoginPress={handleLoginPress} />
      </View>
      <View style={styles.spacer} />
      <View style={styles.bottomLinks}>
        <BottomLinks onRegisterPress={() => navigation.navigate('Register')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingTop: LOGO_TOP_SPACING,
  },
  form: {
    width: FORM_WIDTH,
    marginTop: FORM_TOP_SPACING,
  },
  spacer: {
    flex: 1,
  },
  bottomLinks: {
    marginBottom: BOTTOM_SPACING,
  },
});

export default LoginScreen;
