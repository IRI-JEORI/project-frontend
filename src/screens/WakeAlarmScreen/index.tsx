import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../components/Button';
import { RootStackParamList } from '../../navigation/types';
import { colors } from '../../theme/tokens';

const TIME_TOP_SPACING = 297;
const BUTTON_BOTTOM_SPACING = 52;
const BUTTON_HORIZONTAL_MARGIN = 28;

const WakeAlarmScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'WakeAlarm'>>();
  const { params } = useRoute<RouteProp<RootStackParamList, 'WakeAlarm'>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.time}>07:32</Text>
        <Text style={styles.wakerMessage}>{params.memberName}님이 깨웠어요</Text>
        <Text style={styles.description}>
          일어났다면 인증사진을 찍어주세요{'\n'}사진은 8시간 후 사라져요
        </Text>
      </View>
      <View style={styles.buttonWrapper}>
        <Button
          label="인증사진 찍기"
          variant="secondary"
          onPress={() =>
            navigation.navigate('CameraCapture', {
              memberName: params.memberName,
              onComplete: params.onComplete,
            })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.brown,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: TIME_TOP_SPACING,
  },
  time: {
    fontSize: 64,
    fontWeight: '700',
    color: colors.white,
  },
  wakerMessage: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.folderGray,
    marginTop: 18,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.folderGray,
    textAlign: 'center',
    marginTop: 33,
  },
  buttonWrapper: {
    width: '100%',
    paddingHorizontal: BUTTON_HORIZONTAL_MARGIN,
    paddingBottom: BUTTON_BOTTOM_SPACING,
  },
});

export default WakeAlarmScreen;
