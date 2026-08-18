import React, { useEffect, useState } from 'react';
import {
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import {
  JIWOO_WAKE_PHOTO_STORAGE_KEY,
  JIWOO_WAKE_EXHAUSTED_STORAGE_KEY,
  JIWOO_WAKE_REQUEST_STORAGE_KEY,
  JIWOO_WAKE_GROUP_STORAGE_KEY,
  MINJU_WAKE_PHOTO_STORAGE_KEY,
  MINJU_WAKE_REQUEST_STORAGE_KEY,
  WAKE_GROUP_MINJU_JOINED_STORAGE_KEY,
  WAKE_GROUP_INVITE_CODE_STORAGE_KEY,
} from '../constants/DemoUser';
import { createInviteCode } from '../utils/inviteCode';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;
type Props = NativeStackScreenProps<RootStackParamList, 'AddGroupInvite'>;

export const AddGroupInviteScreen = ({ navigation, route }: Props) => {
  const [copied, setCopied] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useEffect(() => {
    const prepareInviteCode = async () => {
      const generatedCode = createInviteCode();
      await AsyncStorage.setItem(
        WAKE_GROUP_INVITE_CODE_STORAGE_KEY,
        generatedCode,
      );
      setInviteCode(generatedCode);
    };

    prepareInviteCode().catch(() => undefined);
  }, []);

  const copyInviteCode = () => {
    if (!inviteCode) {
      return;
    }
    Clipboard.setString(inviteCode);
    setCopied(true);
  };

  const shareInviteCode = async () => {
    try {
      await Share.share({
        message: `눈눈 그룹 초대 코드: ${inviteCode}`,
      });
    } catch {}
  };

  const enterGroup = async () => {
    const groupType = route.params?.groupType ?? 'wake';
    const groupName = route.params?.groupName?.trim() || '아침 야호';

    try {
      if (groupType === 'wake') {
        await Promise.all([
          AsyncStorage.setItem(JIWOO_WAKE_GROUP_STORAGE_KEY, groupName),
          AsyncStorage.setItem(WAKE_GROUP_MINJU_JOINED_STORAGE_KEY, 'false'),
          AsyncStorage.removeItem(JIWOO_WAKE_PHOTO_STORAGE_KEY),
          AsyncStorage.removeItem(JIWOO_WAKE_EXHAUSTED_STORAGE_KEY),
          AsyncStorage.removeItem(JIWOO_WAKE_REQUEST_STORAGE_KEY),
          AsyncStorage.removeItem(MINJU_WAKE_PHOTO_STORAGE_KEY),
          AsyncStorage.removeItem(MINJU_WAKE_REQUEST_STORAGE_KEY),
        ]);
      }
    } finally {
      navigation.navigate('WaitingForMembers', {
        groupType,
        groupName,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="이전 단계로 이동"
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
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {[40, 207.28].map(left => (
          <View
            key={left}
            style={[
              styles.progressLine,
              {
                left: left * scale,
                top: 55 * scale,
                width: 153.718 * scale,
              },
            ]}
          />
        ))}

        <Text
          style={[styles.stepText, { left: 38.5 * scale, top: 93 * scale }]}
        >
          2 / 2
        </Text>
        <Text style={[styles.title, { left: 38.5 * scale, top: 115 * scale }]}>
          초대 코드를 공유해주세요
        </Text>
        <Text
          style={[styles.description, { left: 38.5 * scale, top: 150 * scale }]}
        >
          코드를 받은 사람이 그룹에 참여해요
        </Text>

        <View
          style={[
            styles.codeBox,
            {
              left: 28 * scale,
              top: 201 * scale,
              width: 346 * scale,
              height: 98 * scale,
              borderRadius: 8 * scale,
            },
          ]}
        >
          <Text style={styles.inviteCode}>{inviteCode}</Text>
        </View>

        <View
          style={[
            styles.actionRow,
            {
              left: 28 * scale,
              top: 315 * scale,
              columnGap: 18 * scale,
            },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="초대 코드 복사"
            accessibilityState={{ disabled: copied }}
            activeOpacity={0.8}
            disabled={copied}
            onPress={copyInviteCode}
            style={[
              styles.actionButton,
              copied ? styles.inactiveButton : styles.activeButton,
              {
                width: 157 * scale,
                height: 44 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <Text
              style={
                copied ? styles.inactiveButtonText : styles.activeButtonText
              }
            >
              코드 복사
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="초대 코드 공유"
            accessibilityState={{ disabled: !copied }}
            activeOpacity={0.8}
            disabled={!copied}
            onPress={shareInviteCode}
            style={[
              styles.actionButton,
              copied ? styles.activeButton : styles.inactiveButton,
              {
                width: 171 * scale,
                height: 44 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <Text
              style={
                copied ? styles.activeButtonText : styles.inactiveButtonText
              }
            >
              공유하기
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="그룹 들어가기"
          activeOpacity={0.8}
          onPress={() => {
            enterGroup().catch(() => undefined);
          }}
          style={[
            styles.enterGroupButton,
            {
              bottom: 22 * scale,
              width: 346 * scale,
              height: 60 * scale,
              borderRadius: 8 * scale,
            },
          ]}
        >
          <Text style={styles.enterGroupButtonText}>그룹 들어가기</Text>
        </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: '100%',
    height: '100%',
  },
  progressLine: {
    position: 'absolute',
    height: 2,
    borderRadius: 8,
    backgroundColor: Colors.secondary,
  },
  stepText: {
    position: 'absolute',
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  title: {
    position: 'absolute',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  description: {
    position: 'absolute',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  codeBox: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
  },
  inviteCode: {
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 32,
    lineHeight: 38,
    letterSpacing: 10.24,
    paddingLeft: 10.24,
  },
  actionRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeButton: {
    backgroundColor: Colors.secondary,
  },
  activeButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  inactiveButton: {
    backgroundColor: Colors.gray,
  },
  inactiveButtonText: {
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  enterGroupButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  enterGroupButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
});
