import React, { useEffect, useRef, useState } from 'react';
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
import { colors } from '../constants/Colors';
import {
  MINJU_WAKE_GROUP_STORAGE_KEY,
  JIWOO_WAKE_GROUP_STORAGE_KEY,
  WAKE_GROUP_INVITE_CODE_STORAGE_KEY,
  WAKE_GROUP_MINJU_JOINED_STORAGE_KEY,
} from '../constants/DemoUser';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;
const INVITE_CODE_LENGTH = 6;
const DEFAULT_GROUP_NAME = '아침 야호';

type Props = NativeStackScreenProps<RootStackParamList, 'InviteCode'>;

export const InviteCodeScreen = ({ navigation }: Props) => {
  const [inviteCode, setInviteCode] = useState('');
  const [savedInviteCode, setSavedInviteCode] = useState('');
  const [groupName, setGroupName] = useState(DEFAULT_GROUP_NAME);
  const inputRef = useRef<TextInput>(null);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  const isComplete = Boolean(savedInviteCode && inviteCode === savedInviteCode);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(WAKE_GROUP_INVITE_CODE_STORAGE_KEY),
      AsyncStorage.getItem(JIWOO_WAKE_GROUP_STORAGE_KEY),
    ])
      .then(([savedCode, savedGroupName]) => {
        setSavedInviteCode(savedCode ?? '');
        setGroupName(savedGroupName?.trim() || DEFAULT_GROUP_NAME);
      })
      .catch(() => undefined);
  }, []);

  const updateInviteCode = (value: string) => {
    setInviteCode(value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
  };

  const enterGroup = async () => {
    await Promise.all([
      AsyncStorage.setItem(MINJU_WAKE_GROUP_STORAGE_KEY, groupName),
      AsyncStorage.setItem(WAKE_GROUP_MINJU_JOINED_STORAGE_KEY, 'true'),
    ]);
    navigation.replace('WaitingForMembers', {
      groupType: 'wake',
      groupName,
      viewer: 'minju',
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={styles.safeArea.backgroundColor}
        barStyle="dark-content"
      />
      <View style={[styles.container, { width: contentWidth }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="홈으로 돌아가기"
          activeOpacity={0.7}
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
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
            style={styles.fill}
          />
        </TouchableOpacity>

        <Text style={[styles.title, { left: 40 * scale, top: 110 * scale }]}>
          초대 코드를 입력해주세요
        </Text>
        <Text
          style={[styles.description, { left: 40 * scale, top: 145 * scale }]}
        >
          코드를 입력하면 그룹에 참여할 수 있어요
        </Text>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="초대 코드 입력란"
          activeOpacity={1}
          onPress={() => inputRef.current?.focus()}
          style={[
            styles.codeRow,
            {
              left: 28 * scale,
              top: 201 * scale,
              columnGap: 8 * scale,
            },
          ]}
        >
          {Array.from({ length: INVITE_CODE_LENGTH }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.codeBox,
                {
                  width: 51 * scale,
                  height: 98 * scale,
                  borderRadius: 8 * scale,
                },
              ]}
            >
              <Text style={styles.codeCharacter}>
                {inviteCode[index] ?? ''}
              </Text>
            </View>
          ))}
          <TextInput
            ref={inputRef}
            accessibilityLabel="6자리 초대 코드"
            autoCapitalize="characters"
            autoCorrect={false}
            caretHidden
            maxLength={INVITE_CODE_LENGTH}
            onChangeText={updateInviteCode}
            value={inviteCode}
            style={styles.hiddenInput}
          />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="그룹 들어가기"
          accessibilityState={{ disabled: !isComplete }}
          activeOpacity={0.8}
          disabled={!isComplete}
          onPress={() => enterGroup().catch(() => undefined)}
          style={[
            styles.enterButton,
            isComplete && styles.enterButtonActive,
            {
              bottom: 22 * scale,
              width: 346 * scale,
              height: 60 * scale,
              borderRadius: 8 * scale,
            },
          ]}
        >
          <Text
            style={[
              styles.enterButtonText,
              isComplete && styles.enterButtonTextActive,
            ]}
          >
            그룹 들어가기
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#F6F6F6',
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
  title: {
    position: 'absolute',
    color: colors.black,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  description: {
    position: 'absolute',
    color: colors.grayBorder,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  codeRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  codeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.folderGray,
  },
  codeCharacter: {
    color: colors.black,
    fontFamily: 'PretendardSemiBold',
    fontSize: 32,
    lineHeight: 38,
  },
  hiddenInput: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    color: 'transparent',
    opacity: 0.01,
  },
  enterButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.folderGray,
  },
  enterButtonActive: {
    backgroundColor: colors.charcoal,
  },
  enterButtonText: {
    color: colors.grayBorder,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
  enterButtonTextActive: {
    color: colors.white,
  },
});
