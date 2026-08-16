import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import NavHeader from '../../components/NavHeader';
import PaginationDots from '../../components/PaginationDots';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/tokens';
import MemberCard from './components/MemberCard';

const CARD_ROW_TOP_SPACING = 156;
const CARD_ROW_HORIZONTAL_MARGIN = 26;
const DOTS_TOP_SPACING = 40;

const WakeGroupScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'WakeGroupDetail'>>();

  return (
    <View style={styles.container}>
      <NavHeader title="아침 야호" rightIcon="menu" onPressBack={() => navigation.goBack()} />
      <View style={styles.cardRow}>
        <MemberCard name="민주" wakeTime="07:32" sleepDuration="4시간째" buttonLabel="아빠 안 잔다" />
        <MemberCard name="지우" wakeTime="07:32" sleepDuration="4시간째" buttonLabel="깨우기" />
      </View>
      <View style={styles.dotsWrapper}>
        <PaginationDots count={3} activeIndex={1} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: CARD_ROW_TOP_SPACING,
    paddingHorizontal: CARD_ROW_HORIZONTAL_MARGIN,
  },
  dotsWrapper: {
    alignItems: 'center',
    marginTop: DOTS_TOP_SPACING,
  },
});

export default WakeGroupScreen;
