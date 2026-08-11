import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Button from '../../components/Button';
import {
  cameraIconSvg,
  galleryIconSvg,
  mailIconSvg,
} from '../../assets/icons/permissionIcons';
import { colors } from '../../theme/tokens';
import PermissionItem from './components/PermissionItem';

const TITLE_TOP_SPACING = 160;
const LIST_TOP_SPACING = 90;
const ITEM_GAP = 48;
const HORIZONTAL_MARGIN = 24;
const BUTTON_BOTTOM_SPACING = 40;

const PermissionScreen = () => {
  return (
    <View style={styles.container}>
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
      <View style={styles.spacer} />
      <Button label="확인" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: TITLE_TOP_SPACING,
    paddingHorizontal: HORIZONTAL_MARGIN,
    paddingBottom: BUTTON_BOTTOM_SPACING,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.brownDarkest,
    lineHeight: 28,
  },
  list: {
    marginTop: LIST_TOP_SPACING,
    gap: ITEM_GAP,
  },
  spacer: {
    flex: 1,
  },
});

export default PermissionScreen;
