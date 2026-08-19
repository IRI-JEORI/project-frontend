import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import NavHeader from '../../components/NavHeader';
import PaginationDots from '../../components/PaginationDots';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/tokens';
import MemberCard from './components/MemberCard';

interface MemberState {
  status: 'pending' | 'done';
  photoUri?: string;
}

const CARD_ROW_TOP_SPACING = 156;
const CARD_ROW_HORIZONTAL_MARGIN = 26;
const DOTS_TOP_SPACING = 40;

const WakeGroupScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'WakeGroupDetail'>>();
  const [jiwooState, setJiwooState] = useState<MemberState>({ status: 'pending' });

  const handleWakePress = () => {
    navigation.navigate('WakeAlarm', {
      memberName: '지우',
      onComplete: (photoUri: string) => setJiwooState({ status: 'done', photoUri }),
    });
  };

  return (
    <View style={styles.container}>
      <NavHeader title="아침 야호" rightIcon="menu" onPressBack={() => navigation.goBack()} />
      <View style={styles.cardRow}>
        <MemberCard
          name="민주"
          status="pending"
          primaryValue="07:32"
          primaryLabel="기상 목표"
          secondaryValue="4시간째"
          secondaryLabel="취침 중"
          actionLabel="아빠 안 잔다"
        />
        {jiwooState.status === 'pending' ? (
          <MemberCard
            name="지우"
            status="pending"
            primaryValue="07:32"
            primaryLabel="기상 목표"
            secondaryValue="4시간째"
            secondaryLabel="취침 중"
            actionLabel="깨우기"
            onPressAction={handleWakePress}
          />
        ) : (
          <MemberCard
            name="지우"
            status="done"
            primaryValue="09:03"
            primaryLabel="기상 시간"
            secondaryValue="23분 째"
            secondaryLabel="기상 중"
            actionLabel="06 : 20"
            photoUri={jiwooState.photoUri}
          />
        )}
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
