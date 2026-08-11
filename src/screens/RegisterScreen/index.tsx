import React from 'react';
import { StyleSheet, View } from 'react-native';
import Logo from '../../components/Logo';
import { colors } from '../../theme/tokens';
import RegisterForm from './components/RegisterForm';

const LOGO_TOP_SPACING = 120;
const FORM_TOP_SPACING = 40;
const FORM_HORIZONTAL_MARGIN = 41;

const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      <Logo color={colors.brownDarkest} />
      <View style={styles.form}>
        <RegisterForm />
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
});

export default RegisterScreen;
