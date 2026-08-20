import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { Colors } from '../constants/Colors';
import { ApiError, nunnunApi } from '../api';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoReview'>;

export const PhotoReviewScreen = ({ navigation, route }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  const proofErrorMessage = (error: unknown) => {
    if (!(error instanceof ApiError)) {
      return '인증사진을 전송하지 못했어요. 다시 시도해주세요.';
    }

    if (error.status === 401) {
      return '데모 사용자를 다시 선택해주세요.';
    }
    if (error.status === 403) {
      return '이 깨우기 요청에 인증사진을 제출할 권한이 없어요.';
    }
    if (error.status === 404) {
      return '깨우기 요청을 찾을 수 없어요.';
    }
    if (
      error.code === 'INVALID_WAKE_PROOF_IMAGE' ||
      error.status === 400 ||
      error.status === 413
    ) {
      return 'JPEG, PNG, WebP 형식의 10MB 이하 사진을 사용해주세요.';
    }
    if (error.code === 'RETRY_EXHAUSTED') {
      return '인증 시도 횟수를 모두 사용했어요.';
    }
    if (error.code === 'INVALID_WAKE_REQUEST_STATUS') {
      return '이미 완료되었거나 인증할 수 없는 깨우기 요청이에요.';
    }
    if (error.code === 'POSE_ANALYSIS_FAILED') {
      return 'AI 포즈 분석에 실패했어요. 잠시 후 다시 시도해주세요.';
    }
    if (error.code === 'WAKE_PROOF_UPLOAD_FAILED') {
      return '인증사진 업로드에 실패했어요. 잠시 후 다시 시도해주세요.';
    }

    return '인증사진을 전송하지 못했어요. 다시 시도해주세요.';
  };

  const uploadPhoto = async () => {
    if (submitting) {
      return;
    }

    if (route.params.requestId === undefined) {
      if (route.params.verificationMode !== undefined) {
        Alert.alert(
          '인증사진 제출 불가',
          '깨우기 요청 정보가 없어 사진을 제출할 수 없어요.',
        );
        return;
      }
      route.params.onComplete?.(route.params.photoUri);
      navigation.goBack();
      return;
    }

    setSubmitting(true);
    try {
      const proofResult = await nunnunApi.wake.uploadProof(
        route.params.requestId,
        route.params.photoUri,
      );
      const resultParams = {
        photoPath: route.params.photoPath,
        recipientName: route.params.recipientName,
        photographer: route.params.photographer,
        attempt: proofResult.attempt_no,
        requestId: route.params.requestId,
        groupId: route.params.groupId,
        verificationMode: route.params.verificationMode,
        proofResult,
      };

      if (proofResult.pose_match_result === 'SUCCESS') {
        navigation.replace('PhotoAnalysisSuccess', resultParams);
        return;
      }

      navigation.replace('PhotoAnalysisFailure', resultParams);
    } catch (error) {
      Alert.alert('인증사진 제출 실패', proofErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <View
          style={[
            styles.reviewCard,
            {
              left: 34 * scale,
              top: 45 * scale,
              width: 334 * scale,
              height: 614 * scale,
              borderRadius: 16 * scale,
            },
          ]}
        >
          <Text style={[styles.title, { top: 48 * scale }]}>
            {route.params.verificationMode
              ? '인증사진을 제출할까요?'
              : '아침야호 그룹에 등록할까요?'}
          </Text>

          <Image
            accessibilityLabel={`${route.params.recipientName}님에게 보낼 인증사진`}
            resizeMode="cover"
            source={{ uri: route.params.photoUri }}
            style={[
              styles.photo,
              {
                left: 19 * scale,
                top: 132.5 * scale,
                width: 296 * scale,
                height: 381.725 * scale,
                borderRadius: 16.465 * scale,
              },
            ]}
          />

          <View
            style={[
              styles.buttonRow,
              {
                left: 21 * scale,
                bottom: 20 * scale,
                columnGap: 16.5 * scale,
              },
            ]}
          >
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="사진 다시 찍기"
              activeOpacity={0.8}
              disabled={submitting}
              onPress={() => navigation.goBack()}
              style={[
                styles.actionButton,
                styles.retakeButton,
                {
                  width: 137.75 * scale,
                  height: 44 * scale,
                  borderRadius: 8 * scale,
                },
              ]}
            >
              <Text style={styles.retakeButtonText}>다시 찍기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="사진 올리기"
              activeOpacity={0.8}
              disabled={submitting}
              onPress={() => uploadPhoto().catch(() => undefined)}
              style={[
                styles.actionButton,
                styles.uploadButton,
                {
                  width: 137.75 * scale,
                  height: 44 * scale,
                  borderRadius: 8 * scale,
                },
              ]}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.textWhite} />
              ) : (
                <Text style={styles.uploadButtonText}>사진 올리기</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
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
    overflow: 'hidden',
    backgroundColor: Colors.background,
  },
  reviewCard: {
    position: 'absolute',
    backgroundColor: Colors.background,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  title: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  photo: {
    position: 'absolute',
  },
  buttonRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  retakeButton: {
    backgroundColor: Colors.gray,
  },
  uploadButton: {
    backgroundColor: '#FF4B4B',
  },
  retakeButtonText: {
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  uploadButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
});
