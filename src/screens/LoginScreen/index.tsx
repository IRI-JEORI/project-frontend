import React from 'react';
import { StyleSheet, View } from 'react-native';
import Logo from '../../components/Logo';
import { colors } from '../../theme/tokens';
import BottomLinks from './components/BottomLinks';
import LoginForm from './components/LoginForm';

const LOGO_TOP_SPACING = 198;
const FORM_TOP_SPACING = 60;
const FORM_WIDTH = 320;
const BOTTOM_SPACING = 87;

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Logo color={colors.brownDarkest} />
      <View style={styles.form}>
        <LoginForm />
      </View>
      <View style={styles.spacer} />
      <View style={styles.bottomLinks}>
        <BottomLinks />
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
