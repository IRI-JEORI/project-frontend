import React, { useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import { ApiError, nunnunApi } from '../api';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'AddGroupName'>;

export const AddGroupNameScreen = ({ navigation, route }: Props) => {
  const [groupName, setGroupName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  const hasGroupName = groupName.trim().length > 0;

  const createErrorMessage = (error: unknown) => {
    if (!(error instanceof ApiError)) {
      return '그룹을 만들지 못했어요. 다시 시도해주세요.';
    }

    switch (error.code) {
      case 'UNAUTHORIZED':
      case 'INVALID_JWT':
      case 'EXPIRED_JWT':
        return '데모 사용자를 다시 선택해주세요.';
      case 'VALIDATION_ERROR':
      case 'INVALID_REQUEST':
        return '그룹 이름을 확인해주세요.';
      case 'ACTIVE_WAKE_GROUP_EXISTS':
        return '이미 참여 중인 깨우기 그룹이 있어요.';
      case 'INVITE_CODE_GENERATION_FAILED':
        return '초대 코드를 만들지 못했어요. 다시 시도해주세요.';
      default:
        return '그룹을 만들지 못했어요. 다시 시도해주세요.';
    }
  };

  const createGroup = async () => {
    const name = groupName.trim();
    const groupType = route.params?.groupType ?? 'wake';
    if (!name || submitting) {
      return;
    }

    if (groupType !== 'wake') {
      navigation.navigate('AddGroupInvite', { groupType, groupName: name });
      return;
    }

    setSubmitting(true);
    try {
      const created = await nunnunApi.group.create(name);
      navigation.navigate('AddGroupInvite', {
        groupType,
        groupName: created.name,
        groupId: created.id,
        inviteCode: created.invite_code,
      });
    } catch (error) {
      Alert.alert('그룹 생성 실패', createErrorMessage(error));
    } finally {
      setSubmitting(false);
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

        <View
          style={[
            styles.progressLine,
            styles.progressLineActive,
            { left: 40 * scale, top: 55 * scale, width: 153.718 * scale },
          ]}
        />
        <View
          style={[
            styles.progressLine,
            { left: 207.28 * scale, top: 55 * scale, width: 153.718 * scale },
          ]}
        />

        <Text
          style={[styles.stepText, { left: 38.5 * scale, top: 93 * scale }]}
        >
          1 / 2
        </Text>
        <Text style={[styles.title, { left: 38.5 * scale, top: 115 * scale }]}>
          그룹 이름을 알려주세요
        </Text>
        <Text
          style={[styles.description, { left: 38.5 * scale, top: 150 * scale }]}
        >
          나중에 언제든 바꿀 수 있어요
        </Text>

        <TextInput
          accessibilityLabel="그룹 이름"
          value={groupName}
          onChangeText={setGroupName}
          placeholder="예) 우리집, 제주도 여행팀"
          placeholderTextColor={Colors.textGray}
          selectionColor={Colors.secondary}
          maxLength={30}
          style={[
            styles.nameInput,
            {
              left: 28 * scale,
              top: 201 * scale,
              width: 346 * scale,
              height: 44 * scale,
              borderRadius: 8 * scale,
              paddingHorizontal: 14 * scale,
            },
          ]}
        />

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{ disabled: !hasGroupName || submitting }}
          activeOpacity={0.8}
          disabled={!hasGroupName || submitting}
          onPress={() => createGroup().catch(() => undefined)}
          style={[
            styles.nextButton,
            (!hasGroupName || submitting) && styles.nextButtonDisabled,
            {
              bottom: 22 * scale,
              width: 346 * scale,
              height: 60 * scale,
              borderRadius: 8 * scale,
            },
          ]}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.textGray} />
          ) : (
            <Text
              style={[
                styles.nextButtonText,
                !hasGroupName && styles.nextButtonTextDisabled,
              ]}
            >
              다음
            </Text>
          )}
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
    backgroundColor: Colors.gray,
  },
  progressLineActive: {
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
  nameInput: {
    position: 'absolute',
    paddingVertical: 0,
    color: Colors.textBlack,
    backgroundColor: Colors.gray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 15,
    lineHeight: 18,
    includeFontPadding: false,
  },
  nextButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  nextButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
  nextButtonTextDisabled: {
    color: Colors.textGray,
  },
});
