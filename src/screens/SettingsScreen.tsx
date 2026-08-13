import React, { useEffect, useState } from 'react';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import {
  DEMO_USER_NAMES,
  DEMO_USER_STORAGE_KEY,
  type DemoUser,
} from '../constants/DemoUser';
import SettingsProfile from '../assets/images/settings-profile.svg';
import SettingsEdit from '../assets/images/settings-edit.svg';
import SettingsToggleOn from '../assets/images/settings-toggle-on.svg';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen = ({ navigation }: Props) => {
  const [calendarEnabled, setCalendarEnabled] = useState(true);
  const [nickname, setNickname] = useState('눈눈');
  const [nicknameDraft, setNicknameDraft] = useState('');
  const [showNicknameSheet, setShowNicknameSheet] = useState(false);
  const [demoUser, setDemoUser] = useState<DemoUser>('jiwoo');
  const [showDemoUserSheet, setShowDemoUserSheet] = useState(false);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;

  useEffect(() => {
    const loadDemoUser = async () => {
      const savedUser = await AsyncStorage.getItem(DEMO_USER_STORAGE_KEY);
      if (savedUser === 'jiwoo' || savedUser === 'minju') {
        setDemoUser(savedUser);
      }
    };

    loadDemoUser().catch(() => undefined);
  }, []);

  const selectDemoUser = async (user: DemoUser) => {
    setDemoUser(user);
    setShowDemoUserSheet(false);
    await AsyncStorage.setItem(DEMO_USER_STORAGE_KEY, user);
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
            <Text style={styles.nickname}>{nickname}</Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="닉네임 변경하기"
              activeOpacity={0.7}
              onPress={() => {
                setNicknameDraft('');
                setShowNicknameSheet(true);
              }}
              style={[styles.nicknameEditRow, { width: 88 * scale }]}
            >
              <Text style={styles.nicknameEditText}>닉네임 변경하기</Text>
            </TouchableOpacity>
          </View>
        </View>

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
          title="에브리타임 시간표"
          description="사진으로 등록하기"
          top={259 * scale}
          scale={scale}
        />

        <SettingRow
          title="데모 사용자"
          description="두 사용자 플로우를 확인해요"
          top={326 * scale}
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

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.7}
          style={[
            styles.logoutRow,
            { left: 28 * scale, top: 393 * scale, width: 346 * scale },
          ]}
        >
          <Text style={styles.rowTitle}>로그아웃</Text>
        </TouchableOpacity>

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
              3번 이상 재설정 시 2주 뒤에 변경이 가능해요
            </Text>
            <TextInput
              accessibilityLabel="새로운 닉네임"
              value={nicknameDraft}
              onChangeText={setNicknameDraft}
              maxLength={20}
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
              onPress={() => {
                const nextNickname = nicknameDraft.trim();
                if (nextNickname) {
                  setNickname(nextNickname);
                }
                setShowNicknameSheet(false);
              }}
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
              <Text style={styles.completeButtonText}>완료</Text>
            </TouchableOpacity>
          </View>
        )}

        {showDemoUserSheet && (
          <View
            style={[
              styles.demoUserSheet,
              {
                height: 245 * scale,
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
            <Text style={styles.demoSheetTitle}>데모 사용자를 선택하세요</Text>
            <Text style={styles.demoSheetDescription}>
              이 기기에서 진행할 사용자 플로우를 정해요
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
};

const SettingRow = ({
  title,
  description,
  top,
  scale,
  rightAccessory,
  onPress,
}: SettingRowProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    activeOpacity={0.7}
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
  logoutRow: {
    position: 'absolute',
    height: 34,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
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
