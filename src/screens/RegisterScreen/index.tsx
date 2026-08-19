import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../components/Logo';
import { colors } from '../../constants/Colors';
import { RootStackParamList } from '../../navigation/types';
import RegisterForm from './components/RegisterForm';

const LOGO_TOP_SPACING = 198;
const FORM_TOP_SPACING = 60;
const FORM_WIDTH = 320;

const RegisterScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Register'>>();

  return (
    <View style={styles.container}>
      <Logo color={colors.brownDarkest} />
      <View style={styles.form}>
        <RegisterForm onRegisterPress={() => navigation.navigate('Permission')} />
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
});

export default RegisterScreen;
