import React, { useState } from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../components/Button';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/tokens';
import { ApiError, nunnunApi } from '../../api';

const PhotoReviewScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'PhotoReview'>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'PhotoReview'>>();
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (submitting) return;
    if (params.requestId === undefined) {
      if (params.verificationMode) {
        Alert.alert('인증사진 제출 불가', '깨우기 요청 정보가 없어요.');
        return;
      }
      params.onComplete?.(params.photoUri);
      navigation.goBack();
      return;
    }

    setSubmitting(true);
    try {
      const result = await nunnunApi.wake.uploadProof(params.requestId, params.photoUri);
      const common = {
        photoPath: params.photoUri.replace(/^file:\/\//, ''),
        recipientName: params.recipientName ?? params.memberName,
        photographer: params.photographer ?? ('jiwoo' as const),
        requestId: params.requestId,
        groupId: params.groupId,
        verificationMode: params.verificationMode,
        proofResult: result,
      };
      if (result.pose_match_result === 'SUCCESS') {
        navigation.replace('PhotoAnalysisSuccess', common);
      } else {
        navigation.replace('PhotoAnalysisFailure', { ...common, attempt: result.attempt_no });
      }
    } catch (error) {
      Alert.alert('인증사진 제출 실패', error instanceof ApiError ? error.message : '인증사진을 제출하지 못했어요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: params.photoUri }} style={styles.photo} resizeMode="cover" />
      <View style={styles.buttonRow}>
        <View style={styles.buttonHalf}><Button label="다시 찍기" variant="secondary" onPress={() => navigation.goBack()} /></View>
        <View style={styles.buttonHalf}><Button label={submitting ? '분석 중...' : '인증사진 올리기'} variant="secondary" onPress={() => submit().catch(() => undefined)} /></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  photo: { position: 'absolute', left: 26, top: 91, width: 351, height: 555, borderRadius: 16 },
  buttonRow: { position: 'absolute', left: 27, bottom: 18, flexDirection: 'row', gap: 20 },
  buttonHalf: { width: 165 },
});

export default PhotoReviewScreen;
