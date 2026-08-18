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
import Clipboard from '@react-native-clipboard/clipboard';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import {
  JIWOO_WAKE_PHOTO_STORAGE_KEY,
  JIWOO_WAKE_EXHAUSTED_STORAGE_KEY,
  JIWOO_WAKE_REQUEST_STORAGE_KEY,
  MINJU_WAKE_PHOTO_STORAGE_KEY,
  MINJU_WAKE_REQUEST_STORAGE_KEY,
  WAKE_GROUP_INVITE_CODE_STORAGE_KEY,
  WAKE_GROUP_MINJU_JOINED_STORAGE_KEY,
} from '../constants/DemoUser';
import MemberStatusLightGray from '../assets/images/member-status-light-gray.svg';
import MemberStatusWhite from '../assets/images/member-status-white.svg';

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
    hasJiwooWakeRequest: false,
    hasJiwooWakeExhausted: false,
    wakeConfirmVisible: false,
  });
  const { width: viewportWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      Promise.all([
        AsyncStorage.getItem(WAKE_GROUP_MINJU_JOINED_STORAGE_KEY),
        AsyncStorage.getItem(JIWOO_WAKE_PHOTO_STORAGE_KEY),
        AsyncStorage.getItem(MINJU_WAKE_PHOTO_STORAGE_KEY),
        AsyncStorage.getItem(MINJU_WAKE_REQUEST_STORAGE_KEY),
        AsyncStorage.getItem(JIWOO_WAKE_REQUEST_STORAGE_KEY),
        AsyncStorage.getItem(JIWOO_WAKE_EXHAUSTED_STORAGE_KEY),
      ])
        .then(
          ([
            savedJoinedState,
            savedPhotoPath,
            savedMinjuPhotoPath,
            savedWakeRequest,
            savedJiwooWakeRequest,
            savedJiwooWakeExhausted,
          ]) => {
            if (isActive) {
              setWakeDemoState(state => ({
                ...state,
                hasMinjuJoined:
                  savedJoinedState === 'true' || state.hasMinjuJoined,
                selfPhotoPath: savedPhotoPath,
                minjuPhotoPath: savedMinjuPhotoPath,
                hasMinjuWakeRequest: savedWakeRequest === 'true',
                hasJiwooWakeRequest: savedJiwooWakeRequest === 'true',
                hasJiwooWakeExhausted: savedJiwooWakeExhausted === 'true',
              }));
            }
          },
        )
        .catch(() => undefined);

      return () => {
        isActive = false;
      };
    }, []),
  );

  const wakeMinju = async () => {
    await AsyncStorage.setItem(MINJU_WAKE_REQUEST_STORAGE_KEY, 'true');
    setWakeDemoState(state => ({
      ...state,
      hasMinjuWakeRequest: true,
    }));
  };

  const wakeJiwoo = async () => {
    await AsyncStorage.setItem(JIWOO_WAKE_REQUEST_STORAGE_KEY, 'true');
    setWakeDemoState(state => ({
      ...state,
      hasJiwooWakeRequest: true,
      wakeConfirmVisible: false,
    }));
  };

  const copyInviteCode = async () => {
    const inviteCode = await AsyncStorage.getItem(
      WAKE_GROUP_INVITE_CODE_STORAGE_KEY,
    );

    if (inviteCode) {
      Clipboard.setString(inviteCode);
    }
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
  const isWakeCompleted = Boolean(
    (firstMemberPhotoPath || wakeDemoState.hasJiwooWakeExhausted) &&
      !isMinjuViewer &&
      !secondMemberPhotoPath,
  );
  const isJiwooBaseState = Boolean(
    !isMinjuViewer &&
      !firstMemberPhotoPath &&
      !secondMemberPhotoPath &&
      !wakeDemoState.hasJiwooWakeExhausted,
  );

  if (!isMinjuViewer && !wakeDemoState.hasMinjuJoined) {
    const emptySlots = [
      { left: 211, top: 145, buttonTop: 373 },
      { left: 23, top: 435, buttonTop: 663 },
      { left: 212, top: 435, buttonTop: 663 },
    ];

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={Colors.background}
          barStyle="dark-content"
        />
        <View style={[styles.container, { width: contentWidth }]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="홈으로 이동"
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

          <View
            style={[
              styles.inviteMemberCard,
              styles.inviteSelfCard,
              {
                left: 21 * scale,
                top: 145 * scale,
                width: 172 * scale,
                height: 219 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <View
              style={[
                styles.inviteMemberMeta,
                { left: 11 * scale, top: 10 * scale },
              ]}
            >
              <MemberStatusLightGray width={17 * scale} height={16 * scale} />
              <Text style={styles.inviteMetaText}>눈눈</Text>
              <View style={styles.inviteMetaDot} />
              <Text style={styles.inviteMetaText}>8시간 남음</Text>
            </View>
            <View
              style={[
                styles.inviteSleepDetails,
                { left: 15 * scale, bottom: 17 * scale },
              ]}
            >
              <View style={styles.sleepDetailColumn}>
                <Text style={styles.inviteSleepValue}>09:03</Text>
                <Text style={styles.inviteSleepLabel}>기상 시간</Text>
              </View>
              <View style={styles.sleepDetailColumn}>
                <Text style={styles.inviteSleepValue}>1시간</Text>
                <Text style={styles.inviteSleepLabel}>목표까지</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="지금 인증할게요"
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('CameraCapture', {
                recipientName: '지우',
                photographer: 'jiwoo',
              })
            }
            style={[
              styles.inviteActionButton,
              styles.inviteActionButtonActive,
              {
                left: 21 * scale,
                top: 373 * scale,
                width: 171 * scale,
                height: 44 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <Text style={styles.inviteActionTextActive}>지금 인증할게요</Text>
          </TouchableOpacity>

          {emptySlots.map((slot, index) => (
            <React.Fragment key={`${slot.left}-${slot.top}`}>
              <View
                style={[
                  styles.inviteMemberCard,
                  styles.inviteEmptyCard,
                  {
                    left: slot.left * scale,
                    top: slot.top * scale,
                    width: 170 * scale,
                    height: 219 * scale,
                    borderRadius: 8 * scale,
                  },
                ]}
              />
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`친구 ${index + 1} 초대하기`}
                activeOpacity={0.7}
                onPress={() => copyInviteCode().catch(() => undefined)}
                style={[
                  styles.inviteActionButton,
                  styles.inviteActionButtonInactive,
                  {
                    left: (slot.left - 1) * scale,
                    top: slot.buttonTop * scale,
                    width: 171 * scale,
                    height: 44 * scale,
                    borderRadius: 8 * scale,
                  },
                ]}
              >
                <Text style={styles.inviteActionTextInactive}>
                  친구 초대하기
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}

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
                      onPress={
                        item === '초대 코드 복사하기'
                          ? () => copyInviteCode().catch(() => undefined)
                          : undefined
                      }
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

  if (
    isMinjuViewer &&
    wakeDemoState.hasMinjuJoined &&
    !wakeDemoState.selfPhotoPath &&
    !wakeDemoState.minjuPhotoPath
  ) {
    const members = [
      { left: 21, name: '눈눈', remaining: '8시간 남음' },
      { left: 211, name: '지우', remaining: '0시간 남음' },
    ];
    const emptySlots = [23, 212];

    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          backgroundColor={Colors.background}
          barStyle="dark-content"
        />
        <View style={[styles.container, { width: contentWidth }]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="홈으로 이동"
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
            {route.params?.groupName || '아침야호'}
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

          {members.map(member => (
            <View
              key={member.name}
              style={[
                styles.inviteMemberCard,
                styles.inviteSelfCard,
                {
                  left: member.left * scale,
                  top: 145 * scale,
                  width: (member.left === 21 ? 172 : 170) * scale,
                  height: 219 * scale,
                  borderRadius: 8 * scale,
                },
              ]}
            >
              <View
                style={[
                  styles.inviteMemberMeta,
                  { left: 11 * scale, top: 10 * scale },
                ]}
              >
                <MemberStatusLightGray width={17 * scale} height={16 * scale} />
                <Text style={styles.inviteMetaText}>{member.name}</Text>
                <View style={styles.inviteMetaDot} />
                <Text style={styles.inviteMetaText}>{member.remaining}</Text>
              </View>
              <View
                style={[
                  styles.inviteSleepDetails,
                  { left: 15 * scale, bottom: 17 * scale },
                ]}
              >
                <View style={styles.sleepDetailColumn}>
                  <Text style={styles.inviteSleepValue}>09:03</Text>
                  <Text style={styles.inviteSleepLabel}>기상 시간</Text>
                </View>
                <View style={styles.sleepDetailColumn}>
                  <Text style={styles.inviteSleepValue}>1시간</Text>
                  <Text style={styles.inviteSleepLabel}>목표까지</Text>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="눈눈 깨우기"
            accessibilityState={{
              disabled: wakeDemoState.hasJiwooWakeRequest,
            }}
            activeOpacity={wakeDemoState.hasJiwooWakeRequest ? 1 : 0.8}
            disabled={wakeDemoState.hasJiwooWakeRequest}
            onPress={() =>
              setWakeDemoState(state => ({
                ...state,
                wakeConfirmVisible: true,
              }))
            }
            style={[
              styles.inviteActionButton,
              wakeDemoState.hasJiwooWakeRequest
                ? styles.wakeActionRequestedButton
                : styles.wakeActionButton,
              {
                left: 21 * scale,
                top: 373 * scale,
                width: 171 * scale,
                height: 44 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <Text
              style={
                wakeDemoState.hasJiwooWakeRequest
                  ? styles.wakeActionRequestedText
                  : styles.inviteActionTextActive
              }
            >
              {wakeDemoState.hasJiwooWakeRequest ? '28:20' : '깨우기'}
            </Text>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            onRequestClose={() =>
              setWakeDemoState(state => ({
                ...state,
                wakeConfirmVisible: false,
              }))
            }
            statusBarTranslucent
            transparent
            visible={wakeDemoState.wakeConfirmVisible}
          >
            <View style={styles.wakeConfirmOverlay}>
              <View
                style={[
                  styles.wakeConfirmPanel,
                  {
                    width: 320 * scale,
                    height: 315 * scale,
                    borderRadius: 16 * scale,
                  },
                ]}
              >
                <Image
                  accessibilityLabel="주의"
                  resizeMode="contain"
                  source={require('../assets/images/wake-caution.png')}
                  style={[
                    styles.wakeConfirmIcon,
                    { width: 104 * scale, height: 104 * scale },
                  ]}
                />
                <Text style={styles.wakeConfirmTitle}>눈눈님을 깨울까요?</Text>
                <Text style={styles.wakeConfirmDescription}>
                  코드를 입력하면 그룹에 참여할 수 있어요
                </Text>
                <View style={styles.wakeConfirmActions}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="안 깨울래요"
                    activeOpacity={0.8}
                    onPress={() =>
                      setWakeDemoState(state => ({
                        ...state,
                        wakeConfirmVisible: false,
                      }))
                    }
                    style={[
                      styles.wakeConfirmButton,
                      styles.wakeConfirmCancelButton,
                    ]}
                  >
                    <Text style={styles.wakeConfirmCancelText}>
                      안 깨울래요
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="깨울게요"
                    activeOpacity={0.8}
                    onPress={() => wakeJiwoo().catch(() => undefined)}
                    style={[
                      styles.wakeConfirmButton,
                      styles.wakeConfirmAcceptButton,
                    ]}
                  >
                    <Text style={styles.wakeConfirmAcceptText}>깨울게요</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="지금 인증할게요"
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('CameraCapture', {
                recipientName: '눈눈',
                photographer: 'minju',
              })
            }
            style={[
              styles.inviteActionButton,
              styles.inviteActionButtonActive,
              {
                left: 210 * scale,
                top: 373 * scale,
                width: 171 * scale,
                height: 44 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <Text style={styles.inviteActionTextActive}>지금 인증할게요</Text>
          </TouchableOpacity>

          {emptySlots.map((left, index) => (
            <React.Fragment key={left}>
              <View
                style={[
                  styles.inviteMemberCard,
                  styles.inviteEmptyCard,
                  {
                    left: left * scale,
                    top: 435 * scale,
                    width: 170 * scale,
                    height: 219 * scale,
                    borderRadius: 8 * scale,
                  },
                ]}
              />
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`친구 ${index + 1} 초대하기`}
                activeOpacity={0.7}
                onPress={() => copyInviteCode().catch(() => undefined)}
                style={[
                  styles.inviteActionButton,
                  styles.inviteActionButtonInactive,
                  {
                    left: (left - 1) * scale,
                    top: 663 * scale,
                    width: 171 * scale,
                    height: 44 * scale,
                    borderRadius: 8 * scale,
                  },
                ]}
              >
                <Text style={styles.inviteActionTextInactive}>
                  친구 초대하기
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}

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
                      onPress={
                        item === '초대 코드 복사하기'
                          ? () => copyInviteCode().catch(() => undefined)
                          : undefined
                      }
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
          accessibilityRole={
            !isMinjuViewer && !wakeDemoState.hasJiwooWakeExhausted
              ? 'button'
              : undefined
          }
          accessibilityLabel={!isMinjuViewer ? '눈눈 인증사진 촬영' : '지우'}
          activeOpacity={
            !isMinjuViewer && !wakeDemoState.hasJiwooWakeExhausted ? 0.85 : 1
          }
          onPress={
            !isMinjuViewer && !wakeDemoState.hasJiwooWakeExhausted
              ? () =>
                  navigation.navigate('CameraCapture', {
                    recipientName: '지우',
                    photographer: 'jiwoo',
                  })
              : undefined
          }
          style={[
            styles.waitingMemberCard,
            wakeDemoState.hasJiwooWakeExhausted &&
              !isMinjuViewer &&
              styles.helpNeededCard,
            {
              left: 21 * scale,
              top: 145 * scale,
              width: 172 * scale,
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
          {wakeDemoState.hasJiwooWakeExhausted && !isMinjuViewer && (
            <>
              <Image
                accessibilityLabel="도움이 필요해요"
                resizeMode="contain"
                source={require('../assets/images/wake-help-fire.png')}
                style={[
                  styles.helpFire,
                  {
                    left: 35 * scale,
                    top: 48 * scale,
                    width: 80 * scale,
                    height: 80 * scale,
                  },
                ]}
              />
              <Text style={[styles.helpNeededText, { top: 128 * scale }]}>
                도움이 필요해요!
              </Text>
            </>
          )}
          {isMinjuViewer &&
            wakeDemoState.hasMinjuWakeRequest &&
            !firstMemberPhotoPath && (
              <Image
                accessibilityLabel="눈눈에게 받은 깨우기 알림"
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
            {(wakeDemoState.hasJiwooWakeExhausted && !isMinjuViewer) ||
            firstMemberPhotoPath ? (
              <MemberStatusWhite width={16.78 * scale} height={16 * scale} />
            ) : (
              <MemberStatusLightGray
                width={16.78 * scale}
                height={16 * scale}
              />
            )}
            <Text
              style={[
                styles.memberName,
                (firstMemberPhotoPath || wakeDemoState.hasJiwooWakeExhausted) &&
                  styles.memberNameOnPhoto,
              ]}
            >
              {isMinjuViewer ? '지우' : '눈눈'}
            </Text>
            <View
              style={[
                styles.memberMetaDot,
                (firstMemberPhotoPath || wakeDemoState.hasJiwooWakeExhausted) &&
                  styles.memberMetaDotOnPhoto,
              ]}
            />
            <Text
              style={[
                styles.memberName,
                (firstMemberPhotoPath || wakeDemoState.hasJiwooWakeExhausted) &&
                  styles.memberNameOnPhoto,
              ]}
            >
              8시간 남음
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
                  (firstMemberPhotoPath ||
                    wakeDemoState.hasJiwooWakeExhausted) &&
                    styles.awakeDetailText,
                ]}
              >
                {wakeDemoState.hasJiwooWakeExhausted && !isMinjuViewer
                  ? '09:03'
                  : firstMemberPhotoPath
                  ? isMinjuViewer
                    ? '09:33'
                    : '09:03'
                  : '07:32'}
              </Text>
              <Text
                style={[
                  styles.sleepLabel,
                  (firstMemberPhotoPath ||
                    wakeDemoState.hasJiwooWakeExhausted) &&
                    styles.awakeDetailText,
                ]}
              >
                {firstMemberPhotoPath || wakeDemoState.hasJiwooWakeExhausted
                  ? '기상 시간'
                  : '기상 목표'}
              </Text>
            </View>
            <View style={styles.sleepDetailColumn}>
              <Text
                style={[
                  styles.sleepValue,
                  (firstMemberPhotoPath ||
                    wakeDemoState.hasJiwooWakeExhausted) &&
                    styles.awakeDetailText,
                ]}
              >
                {wakeDemoState.hasJiwooWakeExhausted && !isMinjuViewer
                  ? '3시간 경과'
                  : firstMemberPhotoPath
                  ? isMinjuViewer
                    ? '01분 째'
                    : '5시간째'
                  : '4시간째'}
              </Text>
              <Text
                style={[
                  styles.sleepLabel,
                  (firstMemberPhotoPath ||
                    wakeDemoState.hasJiwooWakeExhausted) &&
                    styles.awakeDetailText,
                ]}
              >
                {wakeDemoState.hasJiwooWakeExhausted && !isMinjuViewer
                  ? '목표로부터'
                  : firstMemberPhotoPath
                  ? '기상 중'
                  : '취침 중'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={
            wakeDemoState.hasMinjuJoined
              ? `${isMinjuViewer ? '눈눈' : '지우'} 멤버`
              : `${isMinjuViewer ? '눈눈' : '지우'} 참여 상태로 전환`
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
              top: 145 * scale,
              width: 170 * scale,
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
                  accessibilityLabel={`${
                    isMinjuViewer ? '눈눈' : '지우'
                  }가 올린 인증사진`}
                  resizeMode="cover"
                  source={{ uri: `file://${secondMemberPhotoPath}` }}
                  style={styles.memberPhoto}
                />
              )}
              {!isMinjuViewer && wakeDemoState.hasMinjuWakeRequest && (
                <Image
                  accessibilityLabel="지우에게 깨우기 알림 전송됨"
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
                {secondMemberPhotoPath ? (
                  <MemberStatusWhite
                    width={16.78 * scale}
                    height={16 * scale}
                  />
                ) : (
                  <MemberStatusLightGray
                    width={16.78 * scale}
                    height={16 * scale}
                  />
                )}
                <Text style={styles.memberName}>
                  {isMinjuViewer ? '눈눈' : '지우'}
                </Text>
                <View style={styles.memberMetaDot} />
                <Text style={styles.memberName}>0시간 남음</Text>
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
          ) : null}
        </TouchableOpacity>

        <View
          style={[
            styles.memberActionRow,
            {
              left: 21 * scale,
              top: 373 * scale,
              columnGap: 18 * scale,
            },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={
              isJiwooBaseState ? '지금 인증할게요' : undefined
            }
            activeOpacity={0.8}
            onPress={
              isJiwooBaseState
                ? () =>
                    navigation.navigate('CameraCapture', {
                      recipientName: '지우',
                      photographer: 'jiwoo',
                    })
                : undefined
            }
            style={[
              styles.memberActionButton,
              wakeDemoState.hasJiwooWakeExhausted && !isMinjuViewer
                ? styles.photoLockedButton
                : isJiwooBaseState
                ? styles.inviteActionButtonActive
                : firstMemberPhotoPath && !isMinjuViewer
                ? styles.photoLockedButton
                : firstMemberPhotoPath
                ? styles.awakeSelfButton
                : styles.selfAwakeButton,
              {
                width: 171 * scale,
                height: 44 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <Text
              style={[
                styles.selfAwakeButtonText,
                firstMemberPhotoPath &&
                  (isMinjuViewer
                    ? styles.awakeSelfButtonText
                    : styles.photoLockedButtonText),
              ]}
            >
              {wakeDemoState.hasJiwooWakeExhausted && !isMinjuViewer
                ? '깨우기'
                : isJiwooBaseState
                ? '지금 인증할게요'
                : firstMemberPhotoPath && !isMinjuViewer
                ? '잠겼어요'
                : bothMembersAwake
                ? isMinjuViewer
                  ? '30 : 00'
                  : '05 : 20'
                : '아빠 안 잔다'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{
              disabled: !wakeDemoState.hasMinjuJoined || isWakeCompleted,
            }}
            activeOpacity={
              wakeDemoState.hasMinjuJoined && !isWakeCompleted ? 0.8 : 1
            }
            disabled={!wakeDemoState.hasMinjuJoined || isWakeCompleted}
            onPress={
              !isMinjuViewer && !isWakeCompleted
                ? () => wakeMinju().catch(() => undefined)
                : undefined
            }
            style={[
              styles.memberActionButton,
              isWakeCompleted
                ? styles.wakeCompletedButton
                : isJiwooBaseState
                ? styles.wakeActionButton
                : (wakeDemoState.hasMinjuWakeRequest && !isMinjuViewer) ||
                  secondMemberPhotoPath
                ? styles.wakeRequestedButton
                : wakeDemoState.hasMinjuJoined
                ? styles.selfAwakeButton
                : styles.waitingWakeButton,
              {
                width: 171 * scale,
                height: 44 * scale,
                borderRadius: 8 * scale,
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
                isWakeCompleted && styles.wakeCompletedButtonText,
              ]}
            >
              {isWakeCompleted
                ? '기상 완료'
                : bothMembersAwake
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

        {[23, 212].map((left, index) => (
          <React.Fragment key={left}>
            <View
              style={[
                styles.inviteMemberCard,
                styles.inviteEmptyCard,
                {
                  left: left * scale,
                  top: 435 * scale,
                  width: 170 * scale,
                  height: 219 * scale,
                  borderRadius: 8 * scale,
                },
              ]}
            />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`친구 ${index + 1} 초대하기`}
              activeOpacity={0.7}
              onPress={() => copyInviteCode().catch(() => undefined)}
              style={[
                styles.inviteActionButton,
                styles.inviteActionButtonInactive,
                {
                  left: (left - 1) * scale,
                  top: 663 * scale,
                  width: 171 * scale,
                  height: 44 * scale,
                  borderRadius: 8 * scale,
                },
              ]}
            >
              <Text style={styles.inviteActionTextInactive}>친구 초대하기</Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}

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
                    onPress={
                      item === '초대 코드 복사하기'
                        ? () => copyInviteCode().catch(() => undefined)
                        : undefined
                    }
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
  inviteMemberCard: {
    position: 'absolute',
    overflow: 'hidden',
  },
  inviteSelfCard: {
    backgroundColor: Colors.gray,
  },
  inviteEmptyCard: {
    borderWidth: 1,
    borderColor: 'rgba(234, 234, 234, 0.9)',
    backgroundColor: Colors.background,
  },
  inviteMemberMeta: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 3,
  },
  inviteMetaText: {
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 10,
    lineHeight: 12,
  },
  inviteMetaDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.textGray,
  },
  inviteSleepDetails: {
    position: 'absolute',
    flexDirection: 'row',
    columnGap: 37,
  },
  inviteSleepValue: {
    color: Colors.textGray,
    fontFamily: 'PretendardBold',
    fontSize: 14,
    lineHeight: 17,
  },
  inviteSleepLabel: {
    marginTop: 1,
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 10,
    lineHeight: 12,
  },
  inviteActionButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteActionButtonActive: {
    backgroundColor: '#202224',
  },
  wakeActionButton: {
    backgroundColor: '#FF4B4B',
  },
  wakeActionRequestedButton: {
    backgroundColor: Colors.gray,
  },
  wakeActionRequestedText: {
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  wakeConfirmOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  wakeConfirmPanel: {
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  wakeConfirmIcon: {
    marginTop: 26,
  },
  wakeConfirmTitle: {
    marginTop: 15,
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  wakeConfirmDescription: {
    marginTop: 6,
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  wakeConfirmActions: {
    position: 'absolute',
    right: 14,
    bottom: 39,
    left: 14,
    flexDirection: 'row',
    columnGap: 16,
  },
  wakeConfirmButton: {
    flex: 1,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  wakeConfirmCancelButton: {
    backgroundColor: Colors.gray,
  },
  wakeConfirmAcceptButton: {
    backgroundColor: '#FF4B4B',
  },
  wakeConfirmCancelText: {
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 14,
    lineHeight: 17,
  },
  wakeConfirmAcceptText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardMedium',
    fontSize: 14,
    lineHeight: 17,
  },
  inviteActionButtonInactive: {
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.background,
  },
  inviteActionTextActive: {
    color: '#F6F6F6',
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  inviteActionTextInactive: {
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  waitingMemberCard: {
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: Colors.gray,
  },
  helpNeededCard: {
    backgroundColor: '#FF4B4B',
  },
  helpFire: {
    position: 'absolute',
  },
  helpNeededText: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textWhite,
    fontFamily: 'PretendardBold',
    fontSize: 14,
    lineHeight: 17,
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
  memberNameOnPhoto: {
    color: Colors.textWhite,
  },
  memberMetaDot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: Colors.textGray,
  },
  memberMetaDotOnPhoto: {
    backgroundColor: Colors.textWhite,
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
    color: Colors.textWhite,
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
  photoLockedButton: {
    backgroundColor: '#FF4B4B',
  },
  photoLockedButtonText: {
    color: Colors.textWhite,
  },
  wakeCompletedButton: {
    backgroundColor: '#202224',
  },
  wakeCompletedButtonText: {
    color: Colors.textWhite,
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
