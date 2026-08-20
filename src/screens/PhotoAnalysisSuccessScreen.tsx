import React, { useCallback, useEffect, useState } from 'react';
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
import { createWakeProofCompletionState } from '../navigation/selfVerifyNavigation';
import { nunnunApi } from '../api';
import type { GroupSummary } from '../api/types';

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
  const [backendGroups, setBackendGroups] = useState<GroupSummary[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<number[]>([]);
  const [groupsLoading, setGroupsLoading] = useState(false);
  const [shareSaving, setShareSaving] = useState(false);
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  const isBackendResult = route.params.proofResult !== undefined;

  const completeVerification = useCallback(
    async (groups: readonly string[]) => {
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
        groupName: groups.includes('아침 야호')
          ? '아침야호'
          : groups[0] || '아침야호',
        viewer: route.params.photographer,
      });
    },
    [navigation, route.params.photoPath, route.params.photographer],
  );

  useEffect(() => {
    if (isBackendResult) {
      let isActive = true;
      const timer = setTimeout(() => {
        setGroupsLoading(true);
        nunnunApi.group.list()
          .then(response => {
            if (!isActive) return;
            const wakeGroups = response.groups.filter(group => group.type === 'WAKE');
            setBackendGroups(wakeGroups);
            setSelectedGroupIds(
              route.params.groupId !== undefined &&
                wakeGroups.some(group => group.id === route.params.groupId)
                ? [route.params.groupId]
                : [],
            );
            setShareSheetVisible(true);
          })
          .catch(() => {
            if (!isActive) return;
            setShareSheetVisible(true);
            Alert.alert('그룹 조회 실패', '공유할 그룹을 불러오지 못했어요.');
          })
          .finally(() => {
            if (isActive) setGroupsLoading(false);
          });
      }, SHARE_SHEET_DELAY_MS);

      return () => {
        isActive = false;
        clearTimeout(timer);
      };
    }

    let isActive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wakeRequestStorageKey =
      route.params.photographer === 'minju'
        ? MINJU_WAKE_REQUEST_STORAGE_KEY
        : JIWOO_WAKE_REQUEST_STORAGE_KEY;

    AsyncStorage.getItem(wakeRequestStorageKey)
      .then(savedWakeRequest => {
        if (!isActive) {
          return;
        }

        timer = setTimeout(() => {
          if (savedWakeRequest === 'true') {
            completeVerification([SHARE_GROUPS[0]]).catch(() => undefined);
            return;
          }

          setShareSheetVisible(true);
        }, SHARE_SHEET_DELAY_MS);
      })
      .catch(() => {
        if (isActive) {
          setShareSheetVisible(true);
        }
      });

    return () => {
      isActive = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [
    completeVerification,
    isBackendResult,
    navigation,
    route.params.groupId,
    route.params.photographer,
    route.params.verificationMode,
  ]);

  const confirmShare = async () => {
    if (isBackendResult) {
      if (shareSaving || selectedGroupIds.length === 0) return;
      const requestId = route.params.requestId ?? route.params.proofResult?.wake_request_id;
      if (requestId === undefined) {
        Alert.alert('공유 실패', '인증 요청 정보를 찾을 수 없어요.');
        return;
      }
      setShareSaving(true);
      try {
        await nunnunApi.wake.shareProof(requestId, selectedGroupIds);
        navigation.reset(createWakeProofCompletionState(route.params.groupId));
      } catch {
        Alert.alert('공유 실패', '인증 정보를 공유하지 못했어요. 다시 시도해주세요.');
      } finally {
        setShareSaving(false);
      }
      return;
    }
    await completeVerification(selectedGroups);
  };

  const toggleGroup = (groupName: string) => {
    setSelectedGroups(groups =>
      groups.includes(groupName)
        ? groups.filter(group => group !== groupName)
        : [...groups, groupName],
    );
  };

  const toggleBackendGroup = (groupId: number) => {
    if (groupId === route.params.groupId) return;
    setSelectedGroupIds(groupIds =>
      groupIds.includes(groupId)
        ? groupIds.filter(id => id !== groupId)
        : [...groupIds, groupId],
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
            <Text style={styles.score}>
              {route.params.proofResult?.pose_match_score ?? 98}%
            </Text>
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

            {(isBackendResult ? backendGroups : SHARE_GROUPS).map((group, index) => {
              const groupId = typeof group === 'string' ? undefined : group.id;
              const groupName = typeof group === 'string' ? group : group.name;
              const selected = groupId === undefined
                ? selectedGroups.includes(groupName)
                : selectedGroupIds.includes(groupId);
              return (
                <TouchableOpacity
                  key={groupId ?? groupName}
                  accessibilityRole="checkbox"
                  accessibilityLabel={`${groupName} 공유`}
                  accessibilityState={{ checked: selected }}
                  activeOpacity={0.75}
                  disabled={shareSaving || groupId === route.params.groupId}
                  onPress={() =>
                    groupId === undefined
                      ? toggleGroup(groupName)
                      : toggleBackendGroup(groupId)
                  }
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

            {isBackendResult && groupsLoading && (
              <ActivityIndicator
                accessibilityLabel="공유 그룹 불러오는 중"
                color={Colors.secondary}
                style={styles.groupsLoading}
              />
            )}

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="공유할 그룹 확인"
              activeOpacity={0.8}
              disabled={
                isBackendResult
                  ? selectedGroupIds.length === 0 || groupsLoading || shareSaving
                  : selectedGroups.length === 0
              }
              onPress={() => confirmShare().catch(() => undefined)}
              style={[
                styles.confirmButton,
                (isBackendResult
                  ? selectedGroupIds.length === 0 || groupsLoading || shareSaving
                  : selectedGroups.length === 0) && styles.confirmButtonDisabled,
                {
                  left: 15 * scale,
                  top: 407 * scale,
                  width: 346 * scale,
                  height: 65 * scale,
                  borderRadius: 16 * scale,
                },
              ]}
            >
              <Text style={styles.confirmButtonText}>
                {shareSaving ? '공유 중...' : '확인'}
              </Text>
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
  groupsLoading: {
    position: 'absolute',
    top: 190,
    alignSelf: 'center',
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
