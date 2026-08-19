import React from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { colors } from '../constants/Colors';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

const REWARDS = [
  {
    name: '방 인원 확장하기',
    image: require('../assets/images/reward-gift.png'),
  },
  { name: '알람 설정권', image: require('../assets/images/reward-music.png') },
  { name: '코인', image: require('../assets/images/reward-coin.png') },
  { name: '이모지 반응', image: require('../assets/images/reward-flower.png') },
  {
    name: '사진 위 스탬프',
    image: require('../assets/images/reward-notice.png'),
  },
  { name: '뱃지/상장', image: require('../assets/images/reward-medal.png') },
] as const;

const CARD_LEFTS = [33, 150, 267] as const;
const CARD_TOPS = [188, 349.57] as const;

type Props = NativeStackScreenProps<RootStackParamList, 'RewardList'>;

export const RewardListScreen = ({ navigation }: Props) => {
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  const cardWidth = 105 * scale;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="뒤로 가기"
          activeOpacity={0.7}
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            {
              left: 28 * scale,
              top: 17 * scale,
              width: 20 * scale,
              height: 20 * scale,
            },
          ]}
        >
          <Image
            resizeMode="contain"
            source={require('../assets/images/chevron-left.png')}
            style={styles.fullImage}
          />
        </TouchableOpacity>

        <Text style={[styles.screenTitle, { top: 20 * scale }]}>내 리워드</Text>

        <View
          style={[
            styles.summaryRow,
            {
              left: 34 * scale,
              right: 35 * scale,
              top: 83 * scale,
            },
          ]}
        >
          <Text style={styles.summaryTitle}>내 리워드 후보</Text>
          <Text style={styles.rewardCount}>
            <Text style={styles.rewardCountActive}>6</Text>/9
          </Text>
        </View>

        {REWARDS.map((reward, index) => {
          const row = Math.floor(index / 3);
          const column = index % 3;

          return (
            <TouchableOpacity
              key={reward.name}
              accessibilityRole="button"
              accessibilityLabel={reward.name}
              activeOpacity={0.8}
              style={[
                styles.rewardItem,
                {
                  left: CARD_LEFTS[column] * scale,
                  top: CARD_TOPS[row] * scale,
                  width: cardWidth,
                },
              ]}
            >
              <View
                style={[
                  styles.rewardCard,
                  {
                    width: cardWidth,
                    height: 107 * scale,
                    borderRadius: 16 * scale,
                  },
                ]}
              >
                <Image
                  resizeMode="contain"
                  source={reward.image}
                  style={{ width: 60 * scale, height: 60 * scale }}
                />
              </View>
              <Text style={[styles.rewardName, { marginTop: 7 * scale }]}>
                {reward.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {[0, 1, 2].map(slot => (
          <View
            key={slot}
            style={[
              styles.rewardItem,
              {
                left: CARD_LEFTS[slot] * scale,
                top: 511.57 * scale,
                width: cardWidth,
              },
            ]}
          >
            <View
              style={[
                styles.lockedCard,
                {
                  width: cardWidth,
                  height: 107 * scale,
                  borderRadius: 16 * scale,
                },
              ]}
            />
            <Text style={[styles.lockedName, { marginTop: 7 * scale }]}>
              잠김
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.white,
  },
  backButton: {
    position: 'absolute',
    zIndex: 2,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  screenTitle: {
    position: 'absolute',
    alignSelf: 'center',
    color: colors.black,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  summaryRow: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryTitle: {
    color: colors.black,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  rewardCount: {
    color: colors.grayBorder,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  rewardCountActive: {
    color: colors.black,
  },
  rewardItem: {
    position: 'absolute',
    alignItems: 'center',
  },
  rewardCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.folderGray,
    backgroundColor: colors.white,
  },
  rewardName: {
    color: colors.black,
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
  lockedCard: {
    backgroundColor: colors.folderGray,
  },
  lockedName: {
    color: colors.grayBorder,
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
});
