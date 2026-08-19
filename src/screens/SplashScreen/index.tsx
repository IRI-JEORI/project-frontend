import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../constants/Colors';
import Logo from '../../components/Logo';

const LOGO_COLOR = colors.bannerBg;
import { RootStackParamList } from '../../navigation/types';

const TOP_SPACING = 325;
const BOTTOM_SPACING = 386.83;

const SplashScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Splash'>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => navigation.replace('Login')}
    >
      <View style={styles.container}>
        <View style={{ flex: TOP_SPACING }} />
        <Logo color={LOGO_COLOR} />
        <View style={{ flex: BOTTOM_SPACING }} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.charcoal,
  },
});

export default SplashScreen;
