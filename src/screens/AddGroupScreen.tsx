import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../constants/Colors';

const DESIGN_WIDTH = 390;
const MAX_CONTENT_WIDTH = 430;

type GroupType = 'wake' | 'roommate' | null;

export const AddGroupScreen = () => {
  const [selectedType, setSelectedType] = useState<GroupType>(null);
  const {width: viewportWidth} = useWindowDimensions();
  const contentWidth = Math.min(viewportWidth, MAX_CONTENT_WIDTH);
  const scale = Math.min(contentWidth / DESIGN_WIDTH, 1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.background} barStyle="dark-content" />
      <View style={[styles.container, {width: contentWidth}]}>
        <View
          style={[
            styles.progressLine,
            {left: 48.75 * scale, top: 55 * scale, width: 98.222 * scale},
          ]}
        />
        <View
          style={[
            styles.progressLine,
            {left: 151.39 * scale, top: 55 * scale, width: 98.222 * scale},
          ]}
        />
        <View
          style={[
            styles.progressLine,
            {left: 255.28 * scale, top: 55 * scale, width: 98.222 * scale},
          ]}
        />

        <Text style={[styles.stepText, {left: 38.5 * scale, top: 93 * scale}]}>
          1 / 3
        </Text>
        <Text style={[styles.title, {left: 38.5 * scale, top: 115 * scale}]}>
          어떤 그룹을 만들까요?
        </Text>
        <Text style={[styles.description, {left: 35.5 * scale, top: 150 * scale}]}>
          그룹 형태에 따라 기능이 달라져요
        </Text>

        <View
          style={[
            styles.typeRow,
            {
              left: 28 * scale,
              top: 205 * scale,
              columnGap: 12 * scale,
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

        <TouchableOpacity
          accessibilityRole="button"
          activeOpacity={0.8}
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
  progressLine: {
    position: 'absolute',
    height: 2,
    borderRadius: 8,
    backgroundColor: Colors.gray,
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
