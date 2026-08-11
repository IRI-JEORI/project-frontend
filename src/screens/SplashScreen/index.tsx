import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/tokens';
import Logo from '../../components/Logo';

const TOP_SPACING = 325;
const BOTTOM_SPACING = 386.83;

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={{ flex: TOP_SPACING }} />
      <Logo />
      <View style={{ flex: BOTTOM_SPACING }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.brown,
  },
});

export default SplashScreen;
