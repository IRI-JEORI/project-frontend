import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import {
  cameraIconSvg,
  galleryIconSvg,
  mailIconSvg,
} from '../../assets/icons/permissionIcons';
import { colors } from '../../theme/tokens';
import { RootStackParamList } from '../../navigation/types';
import PermissionItem from './components/PermissionItem';

const TITLE_TOP_SPACING = 160;
const LIST_TOP_SPACING = 66;
const ITEM_GAP = 42;
const CONTENT_HORIZONTAL_MARGIN = 37;
const BUTTON_HORIZONTAL_MARGIN = 28;
const BUTTON_BOTTOM_SPACING = 52;

const PermissionScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList, 'Permission'>>();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          NUNNUN 앱 이용을 위해{'\n'}접근 권한 허용이 필요해요
        </Text>
        <View style={styles.list}>
          <PermissionItem
            iconXml={mailIconSvg}
            title="알림 메시지"
            required
            description="친구 깨우기 및 정보 알림"
          />
          <PermissionItem
            iconXml={cameraIconSvg}
            title="카메라"
            required
            description="사진 촬영"
          />
          <PermissionItem
            iconXml={galleryIconSvg}
            title="갤러리"
            required
            description="사진 저장 및 업로드"
          />
        </View>
      </View>
      <View style={styles.spacer} />
      <View style={styles.buttonWrapper}>
        <Button label="확인" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: TITLE_TOP_SPACING,
  },
  content: {
    paddingHorizontal: CONTENT_HORIZONTAL_MARGIN,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.black,
    lineHeight: 29,
  },
  list: {
    marginTop: LIST_TOP_SPACING,
    gap: ITEM_GAP,
  },
  spacer: {
    flex: 1,
  },
  buttonWrapper: {
    paddingHorizontal: BUTTON_HORIZONTAL_MARGIN,
    paddingBottom: BUTTON_BOTTOM_SPACING,
  },
});

export default PermissionScreen;
