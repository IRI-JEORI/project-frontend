import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from '../../../components/Icon';
import Logo from '../../../components/Logo';
import { bellIconSvg } from '../../../assets/icons/homeIcons';
import { colors } from '../../../theme/tokens';

const Header = () => {
  return (
    <View style={styles.row}>
      <Logo width={48.6} height={38.8} color={colors.brownDarkest} />
      <TouchableOpacity>
        <Icon xml={bellIconSvg} size={20} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default Header;
