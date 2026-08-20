import React, { useEffect, useRef, useState } from 'react';
import {
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

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoReview'>;

export const PhotoReviewScreen = ({ navigation, route }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const navigationStartedRef = useRef(false);
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useEffect(
    () => navigation.addListener('focus', () => {
      navigationStartedRef.current = false;
      setSubmitting(false);
    }),
    [navigation],
  );

  const uploadPhoto = () => {
    if (navigationStartedRef.current) {
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

    navigationStartedRef.current = true;
    setSubmitting(true);
    navigation.navigate('PhotoAnalysis', {
      photoPath: route.params.photoPath,
      photoUri: route.params.photoUri,
      recipientName: route.params.recipientName,
      photographer: route.params.photographer,
      attempt: route.params.attempt,
      requestId: route.params.requestId,
      groupId: route.params.groupId,
      verificationMode: route.params.verificationMode,
    });
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
              onPress={uploadPhoto}
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
              <Text style={styles.uploadButtonText}>사진 올리기</Text>
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
