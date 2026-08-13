import React from 'react';
import {
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RootStackParamList } from '../../App';
import { Colors } from '../constants/Colors';
import {
  JIWOO_WAKE_PHOTO_STORAGE_KEY,
  MINJU_WAKE_PHOTO_STORAGE_KEY,
} from '../constants/DemoUser';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoReview'>;

export const PhotoReviewScreen = ({ navigation, route }: Props) => {
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  const uploadPhoto = async () => {
    const photoStorageKey =
      route.params.photographer === 'minju'
        ? MINJU_WAKE_PHOTO_STORAGE_KEY
        : JIWOO_WAKE_PHOTO_STORAGE_KEY;
    await AsyncStorage.setItem(photoStorageKey, route.params.photoPath);
    navigation.pop(2);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.secondary} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <Image
          accessibilityLabel={`${route.params.recipientName}님에게 보낼 인증사진`}
          resizeMode="cover"
          source={{ uri: `file://${route.params.photoPath}` }}
          style={[
            styles.photo,
            {
              left: 26 * scale,
              top: 91 * scale,
              width: 351 * scale,
              height: 555 * scale,
            },
          ]}
        />

        <View
          style={[
            styles.buttonRow,
            {
              left: 27 * scale,
              bottom: 18 * scale,
              columnGap: 20 * scale,
            },
          ]}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="사진 다시 찍기"
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={[
              styles.actionButton,
              {
                width: 165 * scale,
                height: 60 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <Text style={styles.actionButtonText}>다시 찍기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="인증사진 올리기"
            activeOpacity={0.8}
            onPress={() => uploadPhoto().catch(() => undefined)}
            style={[
              styles.actionButton,
              {
                width: 163 * scale,
                height: 60 * scale,
                borderRadius: 8 * scale,
              },
            ]}
          >
            <Text style={styles.actionButtonText}>인증사진 올리기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.secondary,
  },
  container: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: Colors.secondary,
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
    backgroundColor: Colors.gray,
  },
  actionButtonText: {
    color: Colors.textBlack,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
});
