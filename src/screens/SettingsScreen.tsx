import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import {
  DEMO_GROUP_CAPACITY_NAMES,
  DEMO_GROUP_CAPACITY_STORAGE_KEY,
  DEMO_SCHEDULE_STATUS_NAMES,
  DEMO_SCHEDULE_STATUS_STORAGE_KEYS,
  DEMO_USER_NAMES,
  DEMO_USER_STORAGE_KEY,
  JIWOO_WAKE_REQUEST_STORAGE_KEY,
  type DemoGroupCapacity,
  type DemoScheduleStatus,
  type DemoUser,
} from '../constants/DemoUser';
import { registerDeviceAfterLogin } from '../notifications/messaging';
import { ApiError, nunnunApi, tokenStorage } from '../api';
import { clearPendingWakeRequestNavigation } from '../navigation/rootNavigation';
import SettingsProfile from '../assets/images/settings-profile.svg';
import SettingsEdit from '../assets/images/settings-edit.svg';
import SettingsToggleOn from '../assets/images/settings-toggle-on.svg';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const profileErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return '사용자 정보를 불러오지 못했어요.';
  }

  switch (error.code) {
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '사용자 정보를 불러오지 못했어요.';
  }
};

const profileUpdateErrorMessage = (error: unknown) => {
  if (!(error instanceof ApiError)) {
    return '닉네임을 변경하지 못했어요.';
  }

  switch (error.code) {
    case 'VALIDATION_ERROR':
      return '닉네임은 공백이 아니어야 하며 30자 이하여야 해요.';
    case 'UNAUTHORIZED':
    case 'INVALID_JWT':
    case 'EXPIRED_JWT':
      return '데모 사용자를 다시 선택해주세요.';
    case 'USER_NOT_FOUND':
      return '사용자 정보를 찾을 수 없어요.';
    default:
      return '닉네임을 변경하지 못했어요.';
  }
};

export const SettingsScreen = ({ navigation }: Props) => {
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [nickname, setNickname] = useState(DEMO_USER_NAMES.jiwoo);
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [showNicknameSheet, setShowNicknameSheet] = useState(false);
  const [demoUser, setDemoUser] = useState<DemoUser>('jiwoo');
  const [showDemoUserSheet, setShowDemoUserSheet] = useState(false);
  const [demoLoginLoading, setDemoLoginLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [scheduleStatuses, setScheduleStatuses] = useState<
    Record<DemoUser, DemoScheduleStatus>
  >({ jiwoo: 'available', minju: 'available' });
  const [groupCapacity, setGroupCapacity] =
    useState<DemoGroupCapacity>('available');
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;
  const profileUpdateInFlightRef = useRef(false);
  const logoutInFlightRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProfile = async () => {
        setProfileLoading(true);
        setProfileError(null);
        try {
          const accessToken = await tokenStorage.getAccessToken();
          if (!accessToken) {
            if (isActive) {
              setProfileError('데모 사용자를 선택해주세요.');
            }
            return;
          }

          const profile = await nunnunApi.user.getMe();
          if (isActive) {
            setNickname(profile.nickname);
          }
        } catch (error) {
          if (isActive) {
            setProfileError(profileErrorMessage(error));
          }
        } finally {
          if (isActive) {
            setProfileLoading(false);
          }
        }
      };

      loadProfile().catch(() => undefined);
      return () => {
        isActive = false;
      };
    }, []),
  );

  useEffect(() => {
    const loadDemoUser = async () => {
      const savedUser = await AsyncStorage.getItem(DEMO_USER_STORAGE_KEY);
      const [jiwooScheduleStatus, minjuScheduleStatus, savedGroupCapacity] =
        await Promise.all([
          AsyncStorage.getItem(DEMO_SCHEDULE_STATUS_STORAGE_KEYS.jiwoo),
          AsyncStorage.getItem(DEMO_SCHEDULE_STATUS_STORAGE_KEYS.minju),
          AsyncStorage.getItem(DEMO_GROUP_CAPACITY_STORAGE_KEY),
        ]);
      if (savedUser === 'jiwoo' || savedUser === 'minju') {
        setDemoUser(savedUser);
      }
      setScheduleStatuses({
        jiwoo: jiwooScheduleStatus === 'inClass' ? 'inClass' : 'available',
        minju: minjuScheduleStatus === 'inClass' ? 'inClass' : 'available',
      });
      setGroupCapacity(savedGroupCapacity === 'full' ? 'full' : 'available');
    };

    loadDemoUser().catch(() => undefined);
  }, []);

  const selectDemoUser = async (user: DemoUser) => {
    if (demoLoginLoading) {
      return;
    }

    setDemoLoginLoading(true);
    try {
      const { accounts } = await nunnunApi.auth.getDemoAccounts();
      const account = accounts.find(
        candidate => candidate.nickname === DEMO_USER_NAMES[user],
      );
      if (!account) {
        throw new Error('선택한 데모 계정을 찾을 수 없습니다.');
      }

      await nunnunApi.auth.demoLogin(account.id);
      await registerDeviceAfterLogin();
      const profile = await nunnunApi.user.getMe();
      setDemoUser(user);
      setNickname(profile.nickname);
      setProfileError(null);
      await AsyncStorage.setItem(DEMO_USER_STORAGE_KEY, user);

      if (user === 'jiwoo') {
        const hasWakeRequest = await AsyncStorage.getItem(
          JIWOO_WAKE_REQUEST_STORAGE_KEY,
        );
        if (hasWakeRequest === 'true') {
          navigation.replace('WakeNotification');
        }
      }
    } catch (error) {
      Alert.alert(
        '로그인 실패',
        error instanceof ApiError
          ? error.message
          : error instanceof Error
          ? error.message
          : '데모 계정 로그인에 실패했습니다.',
      );
    } finally {
      setDemoLoginLoading(false);
    }
  };

  const selectScheduleStatus = async (
    user: DemoUser,
    status: DemoScheduleStatus,
  ) => {
    setScheduleStatuses(current => ({ ...current, [user]: status }));
    await AsyncStorage.setItem(DEMO_SCHEDULE_STATUS_STORAGE_KEYS[user], status);
  };

  const selectGroupCapacity = async (capacity: DemoGroupCapacity) => {
    setGroupCapacity(capacity);
    await AsyncStorage.setItem(DEMO_GROUP_CAPACITY_STORAGE_KEY, capacity);
  };

  const updateNickname = async () => {
    const nextNickname = nicknameDraft.trim();
    if (
      !nextNickname ||
      nextNickname.length > 30 ||
      profileUpdateInFlightRef.current
    ) {
      return;
    }

    profileUpdateInFlightRef.current = true;
    setProfileUpdating(true);
    try {
      const profile = await nunnunApi.user.updateMe({
        nickname: nextNickname,
      });
      setNickname(profile.nickname);
      setProfileError(null);
      setShowNicknameSheet(false);
    } catch (error) {
      Alert.alert('닉네임 변경 실패', profileUpdateErrorMessage(error));
    } finally {
      profileUpdateInFlightRef.current = false;
      setProfileUpdating(false);
    }
  };

  const logout = async () => {
    if (logoutInFlightRef.current) {
      return;
    }

    logoutInFlightRef.current = true;
    setLogoutLoading(true);
    try {
      await nunnunApi.auth.logout();
      clearPendingWakeRequestNavigation();
      setProfileError('데모 사용자를 선택해주세요.');
      setShowNicknameSheet(false);
      setShowDemoUserSheet(false);
      navigation.reset({ index: 0, routes: [{ name: 'Settings' }] });
    } catch {
      Alert.alert(
        '로그아웃 실패',
        '서버에 연결하지 못했어요. 네트워크를 확인한 뒤 다시 시도해주세요.',
      );
    } finally {
      logoutInFlightRef.current = false;
      setLogoutLoading(false);
    }
  };

  const confirmLogout = () => {
    if (logoutInFlightRef.current) {
      return;
    }
    Alert.alert('로그아웃하시겠어요?', '현재 데모 인증 세션을 종료합니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => {
          logout().catch(() => undefined);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="홈으로 돌아가기"
          activeOpacity={0.7}
          hitSlop={12}
          onPress={() => {
            if (showNicknameSheet) {
              setShowNicknameSheet(false);
              return;
            }
            if (showDemoUserSheet) {
              setShowDemoUserSheet(false);
              return;
            }
            navigation.goBack();
          }}
          style={[
            styles.backButton,
            {
              left: 28 * scale,
              top: 17 * scale,
              width: 24 * scale,
              height: 24 * scale,
            },
          ]}
        >
          <Image
            source={require('../assets/images/chevron-left.png')}
            resizeMode="contain"
            style={styles.fill}
          />
        </TouchableOpacity>

        <Text style={[styles.screenTitle, { top: 22 * scale }]}>
          {showNicknameSheet ? '프로필 변경' : '설정'}
        </Text>

        <View
          style={[
            styles.profileRow,
            { left: 28 * scale, top: 95 * scale, height: 57 * scale },
          ]}
        >
          <SettingsProfile width={57 * scale} height={57 * scale} />
          <SettingsEdit
            width={18 * scale}
            height={18 * scale}
            style={[
              styles.profileEditIcon,
              { left: 44 * scale, top: 40 * scale },
            ]}
          />
          <View style={[styles.profileText, { marginLeft: 18 * scale }]}>
            {profileLoading ? (
              <ActivityIndicator color={Colors.secondary} size="small" />
            ) : (
              <Text style={styles.nickname}>{nickname}</Text>
            )}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="닉네임 변경하기"
              activeOpacity={0.7}
              disabled={profileLoading || profileError !== null}
              onPress={() => {
                setNicknameDraft(nickname);
                setShowNicknameSheet(true);
              }}
              style={[styles.nicknameEditRow, { width: 88 * scale }]}
            >
              <Text style={styles.nicknameEditText}>닉네임 변경하기</Text>
            </TouchableOpacity>
          </View>
        </View>
        {profileError && !profileLoading && (
          <Text accessibilityLiveRegion="polite" style={styles.profileError}>
            {profileError}
          </Text>
        )}

        <SettingRow
          title="캘린더 연동"
          description="다음 일정 자동 반영"
          top={192 * scale}
          scale={scale}
          rightAccessory={
            <TouchableOpacity
              accessibilityRole="switch"
              accessibilityLabel="캘린더 연동"
              accessibilityState={{ checked: calendarEnabled }}
              activeOpacity={0.8}
              onPress={() => setCalendarEnabled(value => !value)}
              style={[
                styles.calendarSwitch,
                { width: 32 * scale, height: 14 * scale },
              ]}
            >
              {calendarEnabled ? (
                <SettingsToggleOn width={32 * scale} height={14 * scale} />
              ) : (
                <View style={styles.switchOffTrack}>
                  <View
                    style={[
                      styles.switchOffThumb,
                      {
                        width: 12 * scale,
                        height: 12 * scale,
                        marginLeft: 1 * scale,
                        borderRadius: 6 * scale,
                      },
                    ]}
                  />
                </View>
              )}
            </TouchableOpacity>
          }
        />

        <SettingRow
          title="기상 목표"
          description="요일별 목표 시간 설정"
          top={259 * scale}
          scale={scale}
          onPress={() => navigation.navigate('WakeTargets')}
        />

        <SettingRow
          title="방해금지 시간"
          description="깨우기 요청을 받지 않을 시간"
          top={326 * scale}
          scale={scale}
          onPress={() => navigation.navigate('DndWindows')}
        />

        <SettingRow
          title="에브리타임 시간표"
          description="고정 일정 관리"
          top={393 * scale}
          scale={scale}
          onPress={() => navigation.navigate('FixedSchedules')}
        />

        <SettingRow
          title="기상 통계"
          description="성공률과 연속 인증 기록"
          top={460 * scale}
          scale={scale}
          onPress={() => navigation.navigate('Stats')}
        />

        <SettingRow
          title="데모 사용자"
          description="두 사용자 플로우를 확인해요"
          top={527 * scale}
          scale={scale}
          onPress={() => setShowDemoUserSheet(true)}
          rightAccessory={
            <View style={styles.demoUserValueRow}>
              <Text style={styles.demoUserValue}>
                {DEMO_USER_NAMES[demoUser]}
              </Text>
              <Text style={styles.demoUserChevron}>›</Text>
            </View>
          }
        />

        <SettingRow
          title={logoutLoading ? '로그아웃 중...' : '로그아웃'}
          description="현재 인증 세션 종료"
          top={594 * scale}
          scale={scale}
          disabled={logoutLoading}
          onPress={confirmLogout}
        />

        {showNicknameSheet && (
          <View
            style={[
              styles.nicknameSheet,
              {
                height: 321 * scale,
                borderTopLeftRadius: 36 * scale,
                borderTopRightRadius: 36 * scale,
              },
            ]}
          >
            <View
              style={[
                styles.sheetGrabber,
                {
                  top: 5 * scale,
                  width: 36 * scale,
                  height: 5 * scale,
                  borderRadius: 3 * scale,
                },
              ]}
            />
            <Text
              style={[styles.sheetTitle, { left: 31 * scale, top: 40 * scale }]}
            >
              새로운 닉네임을 입력하세요
            </Text>
            <Text
              style={[
                styles.sheetDescription,
                { left: 31 * scale, top: 68 * scale },
              ]}
            >
              공백이 아닌 30자 이하의 이름을 입력해주세요
            </Text>
            <TextInput
              accessibilityLabel="새로운 닉네임"
              value={nicknameDraft}
              onChangeText={setNicknameDraft}
              editable={!profileUpdating}
              maxLength={30}
              placeholder="예) 눈눈곡곡"
              placeholderTextColor={Colors.textGray}
              selectionColor={Colors.secondary}
              style={[
                styles.nicknameInput,
                {
                  left: 28 * scale,
                  top: 102 * scale,
                  width: 346 * scale,
                  height: 44 * scale,
                  borderRadius: 8 * scale,
                  paddingLeft: 14 * scale,
                  paddingRight: 75 * scale,
                },
              ]}
            />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="닉네임 변경 완료"
              activeOpacity={0.8}
              disabled={
                profileUpdating ||
                nicknameDraft.trim().length === 0 ||
                nicknameDraft.trim().length > 30
              }
              onPress={() => updateNickname().catch(() => undefined)}
              style={[
                styles.completeButton,
                {
                  left: 313 * scale,
                  top: 102 * scale,
                  width: 61 * scale,
                  height: 44 * scale,
                  borderRadius: 8 * scale,
                },
              ]}
            >
              {profileUpdating ? (
                <ActivityIndicator color={Colors.textWhite} size="small" />
              ) : (
                <Text style={styles.completeButtonText}>완료</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {showDemoUserSheet && (
          <View
            style={[
              styles.demoUserSheet,
              {
                height: 555 * scale,
                borderTopLeftRadius: 36 * scale,
                borderTopRightRadius: 36 * scale,
                paddingHorizontal: 28 * scale,
                paddingTop: 38 * scale,
              },
            ]}
          >
            <View
              style={[
                styles.sheetGrabber,
                {
                  top: 5 * scale,
                  width: 36 * scale,
                  height: 5 * scale,
                  borderRadius: 3 * scale,
                },
              ]}
            />
            <Text style={styles.demoSheetTitle}>
              사용자와 상태를 선택하세요
            </Text>
            <Text style={styles.demoSheetDescription}>
              접속 사용자와 각 사용자의 수업 여부를 따로 정해요
            </Text>
            <View style={[styles.demoUserOptions, { marginTop: 24 * scale }]}>
              {(['jiwoo', 'minju'] as const).map(user => {
                const selected = demoUser === user;
                return (
                  <TouchableOpacity
                    key={user}
                    accessibilityRole="radio"
                    accessibilityLabel={`${DEMO_USER_NAMES[user]} 사용자`}
                    accessibilityState={{ selected }}
                    activeOpacity={0.8}
                    disabled={demoLoginLoading}
                    onPress={() => {
                      selectDemoUser(user).catch(() => undefined);
                    }}
                    style={[
                      styles.demoUserOption,
                      {
                        width: 166 * scale,
                        height: 52 * scale,
                        borderRadius: 8 * scale,
                      },
                      selected && styles.demoUserOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.demoUserOptionText,
                        selected && styles.demoUserOptionTextSelected,
                      ]}
                    >
                      {DEMO_USER_NAMES[user]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.demoStatusLabel, { marginTop: 22 * scale }]}>
              사용자별 수업 상태
            </Text>
            <View style={[styles.scheduleRows, { marginTop: 10 * scale }]}>
              {(['jiwoo', 'minju'] as const).map(user => (
                <View key={user} style={styles.scheduleRow}>
                  <Text style={styles.scheduleUserName}>
                    {DEMO_USER_NAMES[user]}
                  </Text>
                  {(['inClass', 'available'] as const).map(status => {
                    const selected = scheduleStatuses[user] === status;
                    return (
                      <TouchableOpacity
                        key={status}
                        accessibilityRole="radio"
                        accessibilityLabel={`${DEMO_USER_NAMES[user]} ${DEMO_SCHEDULE_STATUS_NAMES[status]}`}
                        accessibilityState={{ selected }}
                        activeOpacity={0.8}
                        onPress={() => {
                          selectScheduleStatus(user, status).catch(
                            () => undefined,
                          );
                        }}
                        style={[
                          styles.scheduleStatusOption,
                          {
                            width: 105 * scale,
                            height: 42 * scale,
                            borderRadius: 8 * scale,
                          },
                          selected && styles.demoUserOptionSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.scheduleStatusOptionText,
                            selected && styles.demoUserOptionTextSelected,
                          ]}
                        >
                          {DEMO_SCHEDULE_STATUS_NAMES[status]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
            <Text style={[styles.demoStatusLabel, { marginTop: 20 * scale }]}>
              그룹 정원 상태
            </Text>
            <View style={[styles.demoUserOptions, { marginTop: 10 * scale }]}>
              {(['available', 'full'] as const).map(capacity => {
                const selected = groupCapacity === capacity;
                return (
                  <TouchableOpacity
                    key={capacity}
                    accessibilityRole="radio"
                    accessibilityLabel={DEMO_GROUP_CAPACITY_NAMES[capacity]}
                    accessibilityState={{ selected }}
                    activeOpacity={0.8}
                    onPress={() =>
                      selectGroupCapacity(capacity).catch(() => undefined)
                    }
                    style={[
                      styles.demoUserOption,
                      {
                        width: 166 * scale,
                        height: 44 * scale,
                        borderRadius: 8 * scale,
                      },
                      selected && styles.demoUserOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.demoUserOptionText,
                        selected && styles.demoUserOptionTextSelected,
                      ]}
                    >
                      {DEMO_GROUP_CAPACITY_NAMES[capacity]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

type SettingRowProps = {
  title: string;
  description: string;
  top: number;
  scale: number;
  rightAccessory?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

const SettingRow = ({
  title,
  description,
  top,
  scale,
  rightAccessory,
  onPress,
  disabled = false,
}: SettingRowProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={title}
    activeOpacity={0.7}
    disabled={disabled}
    onPress={onPress}
    style={[
      styles.settingRow,
      { left: 28 * scale, top, width: 346 * scale, height: 51 * scale },
    ]}
  >
    <View>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowDescription}>{description}</Text>
    </View>
    {rightAccessory}
  </TouchableOpacity>
);

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
  backButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    width: '100%',
    height: '100%',
  },
  screenTitle: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  profileRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    justifyContent: 'center',
  },
  profileError: {
    position: 'absolute',
    left: 103,
    top: 157,
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 12,
    lineHeight: 15,
  },
  profileEditIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  nickname: {
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  nicknameEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.textGray,
  },
  nicknameEditText: {
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
    lineHeight: 17,
  },
  settingRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  rowTitle: {
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
    lineHeight: 17,
  },
  rowDescription: {
    marginTop: 3,
    color: '#757575',
    fontFamily: 'PretendardSemiBold',
    fontSize: 12,
    lineHeight: 15,
  },
  calendarSwitch: {
    marginRight: 7,
    marginTop: 11,
  },
  switchOffTrack: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 7,
    backgroundColor: Colors.textGray,
  },
  switchOffThumb: {
    backgroundColor: Colors.background,
  },
  demoUserValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  demoUserValue: {
    color: '#757575',
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
    lineHeight: 17,
  },
  demoUserChevron: {
    marginLeft: 8,
    marginTop: -2,
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 25,
    lineHeight: 25,
  },
  nicknameSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: Colors.background,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 20,
  },
  demoUserSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    backgroundColor: Colors.background,
    shadowColor: Colors.textBlack,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 20,
  },
  demoSheetTitle: {
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 20,
    lineHeight: 24,
  },
  demoSheetDescription: {
    marginTop: 5,
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 14,
    lineHeight: 17,
  },
  demoStatusLabel: {
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
    lineHeight: 17,
  },
  scheduleRows: {
    rowGap: 10,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleUserName: {
    width: 62,
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 15,
    lineHeight: 18,
  },
  scheduleStatusOption: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
  },
  scheduleStatusOptionText: {
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 14,
    lineHeight: 17,
  },
  demoUserOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoUserOption: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
  },
  demoUserOptionSelected: {
    backgroundColor: Colors.secondary,
  },
  demoUserOptionText: {
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  demoUserOptionTextSelected: {
    color: Colors.textWhite,
  },
  sheetGrabber: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#C7C7C7',
  },
  sheetTitle: {
    position: 'absolute',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 20,
    lineHeight: 24,
  },
  sheetDescription: {
    position: 'absolute',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 14,
    lineHeight: 17,
  },
  nicknameInput: {
    position: 'absolute',
    paddingVertical: 0,
    color: Colors.textBlack,
    backgroundColor: Colors.gray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 15,
    lineHeight: 18,
    includeFontPadding: false,
  },
  completeButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  completeButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 12,
    lineHeight: 15,
  },
});
