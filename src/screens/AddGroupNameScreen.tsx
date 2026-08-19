import React, { useState } from 'react';
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
import type { RootStackParamList } from '../../App';
import { colors } from '../constants/Colors';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'AddGroupName'>;

export const AddGroupNameScreen = ({ navigation, route }: Props) => {
  const [groupName, setGroupName] = useState('');
  const { width: viewportWidth } = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);
  const hasGroupName = groupName.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={colors.white} barStyle="dark-content" />
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
          placeholderTextColor={colors.grayBorder}
          selectionColor={colors.charcoal}
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
          accessibilityState={{ disabled: !hasGroupName }}
          activeOpacity={0.8}
          disabled={!hasGroupName}
          onPress={() =>
            navigation.navigate('AddGroupInvite', {
              groupType: route.params?.groupType ?? 'wake',
              groupName: groupName.trim(),
            })
          }
          style={[
            styles.nextButton,
            !hasGroupName && styles.nextButtonDisabled,
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
              styles.nextButtonText,
              !hasGroupName && styles.nextButtonTextDisabled,
            ]}
          >
            다음
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
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: colors.white,
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
    backgroundColor: colors.folderGray,
  },
  progressLineActive: {
    backgroundColor: colors.charcoal,
  },
  stepText: {
    position: 'absolute',
    color: colors.grayBorder,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
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
  nameInput: {
    position: 'absolute',
    paddingVertical: 0,
    color: colors.black,
    backgroundColor: colors.folderGray,
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
    backgroundColor: colors.charcoal,
  },
  nextButtonDisabled: {
    backgroundColor: colors.folderGray,
  },
  nextButtonText: {
    color: colors.white,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
  nextButtonTextDisabled: {
    color: colors.grayBorder,
  },
});
