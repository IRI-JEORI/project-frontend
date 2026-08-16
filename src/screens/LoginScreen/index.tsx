import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../components/Logo';
import { colors } from '../../theme/tokens';
import { RootStackParamList } from '../../navigation/types';
import BottomLinks from './components/BottomLinks';
import LoginForm from './components/LoginForm';

const LOGO_TOP_SPACING = 198;
const FORM_TOP_SPACING = 60;
const FORM_WIDTH = 320;
const BOTTOM_SPACING = 87;

const LoginScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();

  return (
    <View style={styles.container}>
      <Logo color={colors.brownDarkest} />
      <View style={styles.form}>
        <LoginForm onLoginPress={() => navigation.navigate('Home')} />
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
