import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import WaitingGlow from '../assets/images/waiting-glow.svg';
import WaitingFace from '../assets/images/waiting-face.svg';
import MemberStatusGray from '../assets/images/member-status-gray.svg';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'WaitingForMembers'>;

export const WaitingForMembersScreen = ({ navigation, route }: Props) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { width: viewportWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  const isWakeGroup = route.params?.groupType === 'wake';

  if (isWakeGroup) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={Colors.background}
          barStyle="dark-content"
        />
        <View style={[styles.container, { width: contentWidth }]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="이전 화면으로 이동"
            activeOpacity={0.7}
            hitSlop={12}
            onPress={() => navigation.goBack()}
            style={[
              styles.headerIconButton,
              {
                left: 28 * scale,
                top: 9 * scale,
                width: 24 * scale,
                height: 24 * scale,
              },
            ]}
          >
            <Image
              source={require('../assets/images/chevron-left.png')}
              resizeMode="contain"
              style={styles.fullImage}
            />
          </TouchableOpacity>

          <Text style={[styles.groupTitle, { top: 20 * scale }]}>
            {route.params?.groupName || '아침 야호'}
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="그룹 메뉴"
            activeOpacity={0.7}
            hitSlop={12}
            onPress={() => setMenuVisible(true)}
            style={[
              styles.headerIconButton,
              {
                right: 27 * scale,
                top: 11 * scale,
                width: 20 * scale,
                height: 20 * scale,
              },
            ]}
          >
            <Image
              source={require('../assets/images/menu.png')}
              resizeMode="contain"
              style={styles.fullImage}
            />
          </TouchableOpacity>

          <View
            style={[
              styles.waitingMemberCard,
              {
                left: 25 * scale,
                top: 177 * scale,
                width: 164 * scale,
                height: 219 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <View
              style={[
                styles.memberIdentity,
                { left: 9 * scale, top: 9 * scale, columnGap: 3 * scale },
              ]}
            >
              <MemberStatusGray width={16 * scale} height={16 * scale} />
              <Text style={styles.memberName}>지우</Text>
            </View>
            <View
              style={[
                styles.sleepDetails,
                { left: 27 * scale, bottom: 17 * scale },
              ]}
            >
              <View style={styles.sleepDetailColumn}>
                <Text style={styles.sleepValue}>07:32</Text>
                <Text style={styles.sleepLabel}>기상 목표</Text>
              </View>
              <View style={styles.sleepDetailColumn}>
                <Text style={styles.sleepValue}>4시간째</Text>
                <Text style={styles.sleepLabel}>취침 중</Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.waitingMemberCard,
              {
                left: 211 * scale,
                top: 177 * scale,
                width: 164 * scale,
                height: 219 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <View
              style={[
                styles.cardPageControl,
                { bottom: 97 * scale, columnGap: 8 * scale },
              ]}
            >
              <View style={[styles.pageDot, styles.pageDotActive]} />
              <View style={styles.pageDot} />
              <View style={styles.pageDot} />
            </View>
          </View>

          <View
            style={[
              styles.memberActionRow,
              {
                left: 26 * scale,
                top: 410 * scale,
                columnGap: 21 * scale,
              },
            ]}
          >
            <TouchableOpacity
              accessibilityRole="button"
              activeOpacity={0.8}
              style={[
                styles.memberActionButton,
                styles.selfAwakeButton,
                {
                  width: 164 * scale,
                  height: 30 * scale,
                  borderRadius: 7 * scale,
                },
              ]}
            >
              <Text style={styles.selfAwakeButtonText}>아빠 안 잔다</Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ disabled: true }}
              activeOpacity={1}
              disabled
              style={[
                styles.memberActionButton,
                styles.waitingWakeButton,
                {
                  width: 164 * scale,
                  height: 30 * scale,
                  borderRadius: 7 * scale,
                },
              ]}
            >
              <Text style={styles.waitingWakeButtonText}>깨우기</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.bottomPageControl, { bottom: 45 * scale }]}>
            <View style={[styles.pageDot, styles.pageDotActive]} />
            <View style={styles.pageDot} />
          </View>

          <Modal
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
            statusBarTranslucent
            transparent
            visible={menuVisible}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="그룹 메뉴 닫기"
              onPress={() => setMenuVisible(false)}
              style={styles.menuOverlay}
            >
              <Pressable
                onPress={event => event.stopPropagation()}
                style={[
                  styles.menuPanel,
                  {
                    right: Math.max(
                      (viewportWidth - contentWidth) / 2 + 28 * scale,
                      20,
                    ),
                    top: insets.top + 52 * scale,
                    width: 250 * scale,
                    height: 140 * scale,
                    borderRadius: 30 * scale,
                  },
                ]}
              >
                {['방 나가기', '초대 코드 복사하기', '방 이름 바꾸기'].map(
                  item => (
                    <TouchableOpacity
                      key={item}
                      accessibilityRole="button"
                      activeOpacity={0.7}
                      style={styles.menuItem}
                    >
                      <Text style={styles.menuItemText}>{item}</Text>
                    </TouchableOpacity>
                  ),
                )}
              </Pressable>
            </Pressable>
          </Modal>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <WaitingGlow
          width={290 * scale}
          height={290 * scale}
          style={[styles.waitingGlow, { left: 54.5 * scale, top: 227 * scale }]}
        />
        <WaitingFace
          width={144 * scale}
          height={144 * scale}
          style={[styles.waitingFace, { left: 126 * scale, top: 300 * scale }]}
        />
        <Text style={[styles.title, { top: 549 * scale }]}>
          참여를 기다리고 있어요
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: Colors.background,
  },
  waitingGlow: {
    position: 'absolute',
  },
  waitingFace: {
    position: 'absolute',
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  headerIconButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  groupTitle: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  waitingMemberCard: {
    position: 'absolute',
    backgroundColor: '#DCDCDD',
  },
  memberIdentity: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 8,
    lineHeight: 10,
  },
  sleepDetails: {
    position: 'absolute',
    flexDirection: 'row',
    columnGap: 22,
  },
  sleepDetailColumn: {
    alignItems: 'center',
  },
  sleepValue: {
    color: 'rgba(172, 172, 172, 0.85)',
    fontFamily: 'PretendardBold',
    fontSize: 14,
    lineHeight: 17,
  },
  sleepLabel: {
    marginTop: 1,
    color: 'rgba(172, 172, 172, 0.85)',
    fontFamily: 'PretendardSemiBold',
    fontSize: 10,
    lineHeight: 12,
  },
  cardPageControl: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
  },
  memberActionRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  memberActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selfAwakeButton: {
    backgroundColor: Colors.secondary,
  },
  selfAwakeButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardMedium',
    fontSize: 12,
    lineHeight: 15,
  },
  waitingWakeButton: {
    backgroundColor: '#B8B8B8',
  },
  waitingWakeButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardMedium',
    fontSize: 12,
    lineHeight: 15,
  },
  bottomPageControl: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    columnGap: 8,
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textGray,
  },
  pageDotActive: {
    backgroundColor: Colors.textBlack,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.52)',
  },
  menuPanel: {
    position: 'absolute',
    overflow: 'hidden',
    paddingVertical: 7,
    backgroundColor: 'rgba(244, 244, 244, 0.88)',
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 12,
  },
  menuItem: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  menuItemText: {
    color: Colors.textBlack,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 20,
  },
});
