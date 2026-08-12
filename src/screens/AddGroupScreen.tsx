import React, {useState} from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../App';
import {Colors} from '../constants/Colors';
import type {GroupType} from '../types/group';

const DESIGN_WIDTH = 402;
const MAX_CONTENT_WIDTH = 430;

type Props = NativeStackScreenProps<RootStackParamList, 'AddGroup'>;

export const AddGroupScreen = ({navigation}: Props) => {
  const [selectedType, setSelectedType] = useState<GroupType | null>(null);
  const {width: viewportWidth} = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = contentWidth / DESIGN_WIDTH;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, {width: contentWidth}]}>
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
          ]}>
          <Image
            source={require('../assets/images/chevron-left.png')}
            resizeMode="contain"
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.progressLine,
            selectedType && styles.progressLineActive,
            {left: 49 * scale, top: 50 * scale, width: 98.222 * scale},
          ]}
        />
        <View
          style={[
            styles.progressLine,
            {left: 155.89 * scale, top: 50 * scale, width: 98.222 * scale},
          ]}
        />
        <View
          style={[
            styles.progressLine,
            {left: 262.78 * scale, top: 50 * scale, width: 98.222 * scale},
          ]}
        />

        <Text style={[styles.stepText, {left: 40 * scale, top: 88 * scale}]}>
          1 / 3
        </Text>
        <Text style={[styles.title, {left: 40 * scale, top: 110 * scale}]}>
          어떤 그룹을 만들까요?
        </Text>
        <Text style={[styles.description, {left: 40 * scale, top: 145 * scale}]}>
          그룹 형태에 따라 기능이 달라져요
        </Text>

        <View
          style={[
            styles.typeRow,
            {
              left: 28 * scale,
              top: 200 * scale,
              columnGap: 18 * scale,
            },
          ]}>
          <TypeButton
            label="깨우기 그룹"
            selected={selectedType === 'wake'}
            width={157 * scale}
            height={44 * scale}
            onPress={() => setSelectedType('wake')}
          />
          <TypeButton
            label="룸메이트 그룹"
            selected={selectedType === 'roommate'}
            width={171 * scale}
            height={44 * scale}
            onPress={() => setSelectedType('roommate')}
          />
        </View>

        {selectedType === 'wake' && (
          <Text
            style={[
              styles.typeDescription,
              {left: 36 * scale, top: 250 * scale},
            ]}>
            서로의 알람을 원격으로 울려요
          </Text>
        )}
        {selectedType === 'roommate' && (
          <Text
            style={[
              styles.typeDescription,
              {left: 203 * scale, top: 250 * scale},
            ]}>
            서로의 수면 상태를 확인하고 배려해요
          </Text>
        )}

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityState={{disabled: selectedType === null}}
          activeOpacity={0.8}
          disabled={selectedType === null}
          onPress={() => {
            if (selectedType) {
              navigation.navigate('AddGroupName', {groupType: selectedType});
            }
          }}
          style={[
            styles.nextButton,
            {
              bottom: 22 * scale,
              width: 346 * scale,
              height: 60 * scale,
              borderRadius: 8 * scale,
            },
          ]}>
          <Text style={styles.nextButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

type TypeButtonProps = {
  label: string;
  selected: boolean;
  width: number;
  height: number;
  onPress: () => void;
};

const TypeButton = ({label, selected, width, height, onPress}: TypeButtonProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityState={{selected}}
    activeOpacity={0.8}
    onPress={onPress}
    style={[
      styles.typeButton,
      {width, height},
      selected && styles.typeButtonSelected,
    ]}>
    <Text style={[styles.typeButtonText, selected && styles.typeButtonTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

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
  typeRow: {
    position: 'absolute',
    flexDirection: 'row',
  },
  typeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: Colors.gray,
  },
  typeButtonSelected: {
    backgroundColor: Colors.secondary,
  },
  typeButtonText: {
    color: Colors.textGray,
    fontFamily: 'PretendardSemiBold',
    fontSize: 16,
    lineHeight: 19,
  },
  typeButtonTextSelected: {
    color: Colors.textWhite,
  },
  typeDescription: {
    position: 'absolute',
    color: Colors.textGray,
    fontFamily: 'PretendardMedium',
    fontSize: 12,
    lineHeight: 15,
  },
  nextButton: {
    position: 'absolute',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
  },
  nextButtonText: {
    color: Colors.textWhite,
    fontFamily: 'PretendardSemiBold',
    fontSize: 18,
    lineHeight: 22,
  },
});
