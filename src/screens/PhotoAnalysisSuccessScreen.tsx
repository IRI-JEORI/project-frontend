import React, { useEffect, useState } from 'react';
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
  JIWOO_WAKE_EXHAUSTED_STORAGE_KEY,
  JIWOO_WAKE_REQUEST_STORAGE_KEY,
  JIWOO_WAKE_SUCCESS_STORAGE_KEY,
  MINJU_WAKE_PHOTO_STORAGE_KEY,
  MINJU_WAKE_REQUEST_STORAGE_KEY,
  MINJU_WAKE_SUCCESS_STORAGE_KEY,
} from '../constants/DemoUser';
import PoseResultRingTrack from '../assets/images/pose-result-ring-track.svg';
import PoseResultRingProgress from '../assets/images/pose-result-ring-progress.svg';
import GroupSelectedCheck from '../assets/images/group-selected-check.svg';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;
const SHARE_SHEET_DELAY_MS = 1200;
const SHARE_GROUPS = ['아침 야호', '이리저리', '일찍 일어나는 쥐'] as const;

type Props = NativeStackScreenProps<RootStackParamList, 'PhotoAnalysisSuccess'>;

export const PhotoAnalysisSuccessScreen = ({ navigation, route }: Props) => {
  const { width: viewportWidth } = useWindowDimensions();
  const [shareSheetVisible, setShareSheetVisible] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([
    SHARE_GROUPS[0],
  ]);
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShareSheetVisible(true);
    }, SHARE_SHEET_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const confirmShare = async () => {
    const photoStorageKey =
      route.params.photographer === 'minju'
        ? MINJU_WAKE_PHOTO_STORAGE_KEY
        : JIWOO_WAKE_PHOTO_STORAGE_KEY;
    const wakeRequestStorageKey =
      route.params.photographer === 'minju'
        ? MINJU_WAKE_REQUEST_STORAGE_KEY
        : JIWOO_WAKE_REQUEST_STORAGE_KEY;
    const wakeSuccessStorageKey =
      route.params.photographer === 'minju'
        ? JIWOO_WAKE_SUCCESS_STORAGE_KEY
        : MINJU_WAKE_SUCCESS_STORAGE_KEY;
    const hadWakeRequest =
      (await AsyncStorage.getItem(wakeRequestStorageKey)) === 'true';

    await Promise.all([
      AsyncStorage.setItem(photoStorageKey, route.params.photoPath),
      AsyncStorage.removeItem(wakeRequestStorageKey),
      hadWakeRequest
        ? AsyncStorage.setItem(wakeSuccessStorageKey, 'true')
        : Promise.resolve(),
      AsyncStorage.removeItem(JIWOO_WAKE_EXHAUSTED_STORAGE_KEY),
    ]);

    navigation.replace('WaitingForMembers', {
      groupType: 'wake',
      groupName: selectedGroups.includes('아침 야호')
        ? '아침야호'
        : selectedGroups[0] || '아침야호',
      viewer: route.params.photographer,
    });
  };

  const toggleGroup = (groupName: string) => {
    setSelectedGroups(groups =>
      groups.includes(groupName)
        ? groups.filter(group => group !== groupName)
        : [...groups, groupName],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, { width: contentWidth }]}>
        <Text style={[styles.title, { top: 93 * scale }]}>판정 완료!</Text>
        <Text style={[styles.description, { top: 128 * scale }]}>
          AI가 분석했어요
        </Text>

        <View
          style={[
            styles.resultCard,
            {
              left: 34 * scale,
              top: 174 * scale,
              width: 334 * scale,
              height: 384 * scale,
              borderRadius: 16 * scale,
            },
          ]}
        >
          <PoseResultRingTrack
            width={269.051 * scale}
            height={270 * scale}
            style={[styles.ring, { left: 32 * scale, top: 68 * scale }]}
          />
          <PoseResultRingProgress
            width={270 * scale}
            height={270 * scale}
            style={[styles.ring, { left: 32 * scale, top: 68 * scale }]}
          />
          <Image
            accessibilityLabel="포즈 판정 완료"
            resizeMode="contain"
            source={require('../assets/images/pose-result-bomb.png')}
            style={[
              styles.bombIcon,
              {
                left: 167 * scale,
                top: 45 * scale,
                width: 72 * scale,
                height: 72 * scale,
              },
            ]}
          />
          <View style={[styles.scoreArea, { top: 168 * scale }]}>
            <Text style={styles.scoreLabel}>포즈 일치율</Text>
            <Text style={styles.score}>98%</Text>
          </View>
        </View>

        {shareSheetVisible && (
          <View
            style={[
              styles.shareSheet,
              {
                left: 13 * scale,
                top: 306 * scale,
                width: 376 * scale,
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
              style={[styles.shareTitle, { left: 21 * scale, top: 64 * scale }]}
            >
              공유할 그룹을 선택해주세요
            </Text>
            <Text
              style={[
                styles.shareDescription,
                { left: 21 * scale, top: 99 * scale },
              ]}
            >
              선택한 그룹에만 내 정보가 입력돼요
            </Text>

            {SHARE_GROUPS.map((groupName, index) => {
              const selected = selectedGroups.includes(groupName);
              return (
                <TouchableOpacity
                  key={groupName}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${groupName} 공유`}
                  accessibilityState={{ checked: selected }}
                  activeOpacity={0.75}
                  onPress={() => toggleGroup(groupName)}
                  style={[
                    styles.groupOption,
                    { top: (134 + index * 46) * scale },
                  ]}
                >
                  <Text style={styles.groupOptionText}>{groupName}</Text>
                  {selected ? (
                    <GroupSelectedCheck
                      width={28 * scale}
                      height={28 * scale}
                    />
                  ) : (
                    <View
                      style={[
                        styles.unselectedCheck,
                        {
                          width: 28 * scale,
                          height: 28 * scale,
                          borderRadius: 8 * scale,
                        },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="공유할 그룹 확인"
              activeOpacity={0.8}
              disabled={selectedGroups.length === 0}
              onPress={() => confirmShare().catch(() => undefined)}
              style={[
                styles.confirmButton,
                selectedGroups.length === 0 && styles.confirmButtonDisabled,
                {
                  left: 15 * scale,
                  top: 407 * scale,
                  width: 346 * scale,
                  height: 65 * scale,
                  borderRadius: 16 * scale,
                },
              ]}
            >
              <Text style={styles.confirmButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        )}
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
  title: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  description: {
    position: 'absolute',
    alignSelf: 'center',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  resultCard: {
    position: 'absolute',
    backgroundColor: Colors.background,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  ring: {
    position: 'absolute',
  },
  bombIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  scoreArea: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
  },
  scoreLabel: {
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 14,
    lineHeight: 17,
  },
  score: {
    marginTop: 1,
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 40,
    lineHeight: 48,
  },
  shareSheet: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Colors.background,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
  },
  sheetGrabber: {
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: '#C4C4C4',
  },
  shareTitle: {
    position: 'absolute',
    color: Colors.textBlack,
    fontFamily: 'PretendardBold',
    fontSize: 24,
    lineHeight: 29,
  },
  shareDescription: {
    position: 'absolute',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  groupOption: {
    position: 'absolute',
    right: 17,
    left: 28,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupOptionText: {
    color: Colors.textBlack,
    fontFamily: 'PretendardMedium',
    fontSize: 16,
    lineHeight: 19,
  },
  unselectedCheck: {
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: Colors.background,
  },
  confirmButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF4B4B',
  },
  confirmButtonDisabled: {
    backgroundColor: Colors.gray,
  },
  confirmButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 23,
  },
});
