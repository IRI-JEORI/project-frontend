import React, { useCallback, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import {
  JIWOO_WAKE_PHOTO_STORAGE_KEY,
  MINJU_WAKE_PHOTO_STORAGE_KEY,
  MINJU_WAKE_REQUEST_STORAGE_KEY,
  WAKE_GROUP_MINJU_JOINED_STORAGE_KEY,
} from '../constants/DemoUser';
import WaitingGlow from '../assets/images/waiting-glow.svg';
import WaitingFace from '../assets/images/waiting-face.svg';
import MemberStatusGray from '../assets/images/member-status-gray.svg';
import MemberStatusYellow from '../assets/images/member-status-yellow.svg';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'WaitingForMembers'>;

export const WaitingForMembersScreen = ({ navigation, route }: Props) => {
  const isMinjuViewer = route.params?.viewer === 'minju';
  const [wakeDemoState, setWakeDemoState] = useState({
    menuVisible: false,
    hasMinjuJoined: isMinjuViewer,
    selfPhotoPath: null as string | null,
    minjuPhotoPath: null as string | null,
    hasMinjuWakeRequest: false,
  });
  const { width: viewportWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  const isWakeGroup = route.params?.groupType === 'wake';

  useFocusEffect(
    useCallback(() => {
      if (!isWakeGroup) {
        return undefined;
      }

      let isActive = true;
      Promise.all([
        AsyncStorage.getItem(WAKE_GROUP_MINJU_JOINED_STORAGE_KEY),
        AsyncStorage.getItem(JIWOO_WAKE_PHOTO_STORAGE_KEY),
        AsyncStorage.getItem(MINJU_WAKE_PHOTO_STORAGE_KEY),
        AsyncStorage.getItem(MINJU_WAKE_REQUEST_STORAGE_KEY),
      ])
        .then(
          ([
            savedJoinedState,
            savedPhotoPath,
            savedMinjuPhotoPath,
            savedWakeRequest,
          ]) => {
            if (isActive) {
              setWakeDemoState(state => ({
                ...state,
                hasMinjuJoined:
                  savedJoinedState === 'true' || state.hasMinjuJoined,
                selfPhotoPath: savedPhotoPath,
                minjuPhotoPath: savedMinjuPhotoPath,
                hasMinjuWakeRequest: savedWakeRequest === 'true',
              }));
            }
          },
        )
        .catch(() => undefined);

      return () => {
        isActive = false;
      };
    }, [isWakeGroup]),
  );

  const wakeMinju = async () => {
    await AsyncStorage.setItem(MINJU_WAKE_REQUEST_STORAGE_KEY, 'true');
    setWakeDemoState(state => ({
      ...state,
      hasMinjuWakeRequest: true,
    }));
  };

  const firstMemberPhotoPath = isMinjuViewer
    ? wakeDemoState.minjuPhotoPath
    : wakeDemoState.selfPhotoPath;
  const secondMemberPhotoPath = isMinjuViewer
    ? wakeDemoState.selfPhotoPath
    : wakeDemoState.minjuPhotoPath;
  const bothMembersAwake = Boolean(
    wakeDemoState.selfPhotoPath && wakeDemoState.minjuPhotoPath,
  );

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
            onPress={() => navigation.popTo('Home')}
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
            onPress={() =>
              setWakeDemoState(state => ({ ...state, menuVisible: true }))
            }
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

          <TouchableOpacity
            accessibilityRole={!isMinjuViewer ? 'button' : undefined}
            accessibilityLabel={!isMinjuViewer ? '지우 인증사진 촬영' : '민주'}
            activeOpacity={!isMinjuViewer ? 0.85 : 1}
            onPress={
              !isMinjuViewer
                ? () =>
                    navigation.navigate('CameraCapture', {
                      recipientName: '민주',
                    })
                : undefined
            }
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
            {firstMemberPhotoPath && (
              <Image
                accessibilityIgnoresInvertColors
                resizeMode="cover"
                source={{ uri: `file://${firstMemberPhotoPath}` }}
                style={styles.memberPhoto}
              />
            )}
            {isMinjuViewer &&
              wakeDemoState.hasMinjuWakeRequest &&
              !firstMemberPhotoPath && (
                <Image
                  accessibilityLabel="지우에게 받은 깨우기 알림"
                  resizeMode="contain"
                  source={require('../assets/images/wake-alarm.png')}
                  style={[
                    styles.wakeAlarm,
                    {
                      width: 28 * scale,
                      height: 28 * scale,
                      top: 95 * scale,
                    },
                  ]}
                />
              )}
            <View
              style={[
                styles.memberIdentity,
                { left: 9 * scale, top: 9 * scale, columnGap: 3 * scale },
              ]}
            >
              {isMinjuViewer ? (
                <MemberStatusYellow width={16 * scale} height={16 * scale} />
              ) : (
                <MemberStatusGray width={16 * scale} height={16 * scale} />
              )}
              <Text style={styles.memberName}>
                {isMinjuViewer ? '민주' : '지우'}
              </Text>
            </View>
            <View
              style={[
                styles.sleepDetails,
                { left: 27 * scale, bottom: 17 * scale },
              ]}
            >
              <View style={styles.sleepDetailColumn}>
                <Text
                  style={[
                    styles.sleepValue,
                    firstMemberPhotoPath && styles.awakeDetailText,
                  ]}
                >
                  {firstMemberPhotoPath
                    ? isMinjuViewer
                      ? '09:33'
                      : '09:03'
                    : '07:32'}
                </Text>
                <Text
                  style={[
                    styles.sleepLabel,
                    firstMemberPhotoPath && styles.awakeDetailText,
                  ]}
                >
                  {firstMemberPhotoPath ? '기상 시간' : '기상 목표'}
                </Text>
              </View>
              <View style={styles.sleepDetailColumn}>
                <Text
                  style={[
                    styles.sleepValue,
                    firstMemberPhotoPath && styles.awakeDetailText,
                  ]}
                >
                  {firstMemberPhotoPath
                    ? isMinjuViewer
                      ? '01분 째'
                      : '23분 째'
                    : '4시간째'}
                </Text>
                <Text
                  style={[
                    styles.sleepLabel,
                    firstMemberPhotoPath && styles.awakeDetailText,
                  ]}
                >
                  {firstMemberPhotoPath ? '기상 중' : '취침 중'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={
              wakeDemoState.hasMinjuJoined
                ? '민주 멤버'
                : '민주 참여 상태로 전환'
            }
            activeOpacity={wakeDemoState.hasMinjuJoined ? 1 : 0.85}
            onPress={() =>
              setWakeDemoState(state => ({
                ...state,
                hasMinjuJoined: true,
              }))
            }
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
            {wakeDemoState.hasMinjuJoined ? (
              <>
                {secondMemberPhotoPath && (
                  <Image
                    accessibilityIgnoresInvertColors
                    accessibilityLabel="지우가 올린 인증사진"
                    resizeMode="cover"
                    source={{ uri: `file://${secondMemberPhotoPath}` }}
                    style={styles.memberPhoto}
                  />
                )}
                {!isMinjuViewer && wakeDemoState.hasMinjuWakeRequest && (
                  <Image
                    accessibilityLabel="민주에게 깨우기 알림 전송됨"
                    resizeMode="contain"
                    source={require('../assets/images/wake-alarm.png')}
                    style={[
                      styles.wakeAlarm,
                      {
                        width: 28 * scale,
                        height: 28 * scale,
                        top: 95 * scale,
                      },
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.memberIdentity,
                    { left: 9 * scale, top: 9 * scale, columnGap: 3 * scale },
                  ]}
                >
                  {isMinjuViewer ? (
                    <MemberStatusGray width={16 * scale} height={16 * scale} />
                  ) : (
                    <MemberStatusYellow
                      width={16 * scale}
                      height={16 * scale}
                    />
                  )}
                  <Text style={styles.memberName}>
                    {isMinjuViewer ? '지우' : '민주'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.sleepDetails,
                    { left: 27 * scale, bottom: 17 * scale },
                  ]}
                >
                  <View style={styles.sleepDetailColumn}>
                    <Text
                      style={[
                        styles.sleepValue,
                        secondMemberPhotoPath && styles.awakeDetailText,
                      ]}
                    >
                      {secondMemberPhotoPath
                        ? isMinjuViewer
                          ? '09:03'
                          : '09:33'
                        : '07:32'}
                    </Text>
                    <Text
                      style={[
                        styles.sleepLabel,
                        secondMemberPhotoPath && styles.awakeDetailText,
                      ]}
                    >
                      {secondMemberPhotoPath ? '기상 시간' : '기상 목표'}
                    </Text>
                  </View>
                  <View style={styles.sleepDetailColumn}>
                    <Text
                      style={[
                        styles.sleepValue,
                        secondMemberPhotoPath && styles.awakeDetailText,
                      ]}
                    >
                      {secondMemberPhotoPath
                        ? isMinjuViewer
                          ? '23분 째'
                          : '01분 째'
                        : '4시간째'}
                    </Text>
                    <Text
                      style={[
                        styles.sleepLabel,
                        secondMemberPhotoPath && styles.awakeDetailText,
                      ]}
                    >
                      {secondMemberPhotoPath ? '기상 중' : '취침 중'}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
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
            )}
          </TouchableOpacity>

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
                firstMemberPhotoPath
                  ? styles.awakeSelfButton
                  : styles.selfAwakeButton,
                {
                  width: 164 * scale,
                  height: 30 * scale,
                  borderRadius: 7 * scale,
                },
              ]}
            >
              <Text
                style={[
                  styles.selfAwakeButtonText,
                  firstMemberPhotoPath && styles.awakeSelfButtonText,
                ]}
              >
                {bothMembersAwake
                  ? isMinjuViewer
                    ? '30 : 00'
                    : '05 : 20'
                  : '아빠 안 잔다'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{
                disabled: !wakeDemoState.hasMinjuJoined,
              }}
              activeOpacity={wakeDemoState.hasMinjuJoined ? 0.8 : 1}
              disabled={!wakeDemoState.hasMinjuJoined}
              onPress={
                !isMinjuViewer
                  ? () => wakeMinju().catch(() => undefined)
                  : undefined
              }
              style={[
                styles.memberActionButton,
                (wakeDemoState.hasMinjuWakeRequest && !isMinjuViewer) ||
                secondMemberPhotoPath
                  ? styles.wakeRequestedButton
                  : wakeDemoState.hasMinjuJoined
                  ? styles.selfAwakeButton
                  : styles.waitingWakeButton,
                {
                  width: 164 * scale,
                  height: 30 * scale,
                  borderRadius: 7 * scale,
                },
              ]}
            >
              <Text
                style={[
                  styles.waitingWakeButtonText,
                  wakeDemoState.hasMinjuWakeRequest &&
                    !isMinjuViewer &&
                    styles.wakeRequestedButtonText,
                  secondMemberPhotoPath && styles.wakeRequestedButtonText,
                ]}
              >
                {bothMembersAwake
                  ? isMinjuViewer
                    ? '05 : 20'
                    : '30 : 00'
                  : isMinjuViewer && secondMemberPhotoPath
                  ? '06 : 20'
                  : wakeDemoState.hasMinjuWakeRequest && !isMinjuViewer
                  ? '28 : 20'
                  : '깨우기'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.bottomPageControl, { bottom: 45 * scale }]}>
            <View style={[styles.pageDot, styles.pageDotActive]} />
            <View style={styles.pageDot} />
          </View>

          <Modal
            animationType="fade"
            onRequestClose={() =>
              setWakeDemoState(state => ({ ...state, menuVisible: false }))
            }
            statusBarTranslucent
            transparent
            visible={wakeDemoState.menuVisible}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="그룹 메뉴 닫기"
              onPress={() =>
                setWakeDemoState(state => ({ ...state, menuVisible: false }))
              }
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
    overflow: 'hidden',
    backgroundColor: '#DCDCDD',
  },
  memberPhoto: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  wakeAlarm: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
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
  awakeDetailText: {
    color: Colors.secondary,
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
  awakeSelfButton: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.background,
  },
  selfAwakeButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardMedium',
    fontSize: 12,
    lineHeight: 15,
  },
  awakeSelfButtonText: {
    color: Colors.secondary,
  },
  waitingWakeButton: {
    backgroundColor: '#B8B8B8',
  },
  wakeRequestedButton: {
    borderWidth: 1,
    borderColor: Colors.secondary,
    backgroundColor: Colors.background,
  },
  waitingWakeButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardMedium',
    fontSize: 12,
    lineHeight: 15,
  },
  wakeRequestedButtonText: {
    color: Colors.secondary,
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
