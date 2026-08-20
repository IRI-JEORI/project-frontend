import React, { useRef, useState } from 'react';
import {
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
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { ApiError, nunnunApi } from '../api';
import { Colors } from '../constants/Colors';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;
const INVITE_CODE_LENGTH = 6;

type Props = NativeStackScreenProps<RootStackParamList, 'InviteCode'>;

export const InviteCodeScreen = ({ navigation }: Props) => {
  const [inviteCode, setInviteCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);
  const inputRef = useRef<TextInput>(null);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  const isComplete = inviteCode.length === INVITE_CODE_LENGTH;

  const updateInviteCode = (value: string) => {
    setInviteCode(value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase());
  };

  const enterGroup = async () => {
    if (!isComplete || inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    try {
      const preview = await nunnunApi.group.preview(inviteCode);
      if (!preview.valid) {
        Alert.alert(
          '그룹 확인',
          preview.reason === 'GROUP_FULL'
            ? '이미 정원이 가득 찬 그룹이에요.'
            : '참여할 수 없는 초대코드예요.',
        );
        return;
      }
      const joined = await nunnunApi.group.join(inviteCode);
      navigation.replace('WakeGroupDetail', { groupId: joined.id });
    } catch (error) {
      Alert.alert(
        '그룹 참여 실패',
        error instanceof ApiError
          ? error.message
          : '그룹에 참여하지 못했어요.',
      );
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
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
          accessibilityState={{ disabled: !isComplete || submitting }}
          activeOpacity={0.8}
          disabled={!isComplete || submitting}
          onPress={() => enterGroup().catch(() => undefined)}
          style={[
            styles.enterButton,
              isComplete && !submitting && styles.enterButtonActive,
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
              isComplete && !submitting && styles.enterButtonTextActive,
            ]}
          >
            {submitting ? '확인 중...' : '그룹 들어가기'}
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
  codeRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  codeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray,
  },
  codeCharacter: {
    color: Colors.textBlack,
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
    backgroundColor: Colors.gray,
  },
  enterButtonActive: {
    backgroundColor: Colors.secondary,
  },
  enterButtonText: {
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
  enterButtonTextActive: {
    color: Colors.textWhite,
  },
});
