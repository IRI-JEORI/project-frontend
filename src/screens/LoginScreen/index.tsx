import React from 'react';
import { StyleSheet, View } from 'react-native';
import Logo from '../../components/Logo';
import { colors } from '../../theme/tokens';
import BottomLinks from './components/BottomLinks';
import LoginForm from './components/LoginForm';

const LOGO_TOP_SPACING = 198;
const FORM_TOP_SPACING = 64;
const FORM_HORIZONTAL_MARGIN = 41;
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
    alignSelf: 'stretch',
    marginTop: FORM_TOP_SPACING,
    marginHorizontal: FORM_HORIZONTAL_MARGIN,
  },
  spacer: {
    flex: 1,
  },
  bottomLinks: {
    marginBottom: BOTTOM_SPACING,
  },
});

export default LoginScreen;
