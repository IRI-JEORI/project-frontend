import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../theme/tokens';

export interface ReturnTimeSheetProps {
  visible: boolean;
  onClose: () => void;
}

const ReturnTimeSheet = ({ visible, onClose }: ReturnTimeSheetProps) => {
  const [value, setValue] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouchable} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.grabber} />
          <Text style={styles.title}>오늘의 귀가 시간을 알려주세요!</Text>
          <Text style={styles.subtitle}>귀가 시간이 웨이키에게 전달돼요</Text>
          <Text style={styles.label}>변경된 귀가 시간을 입력하세요</Text>
          <TextInput
            style={styles.input}
            placeholder="예) 23:00"
            placeholderTextColor={colors.grayBorder}
            value={value}
            onChangeText={setValue}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.sendButton} onPress={onClose}>
              <Text style={styles.sendLabel}>전송하기</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelLabel}>취소하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backdropTouchable: {
    flex: 1,
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 32,
    paddingTop: 12,
    paddingBottom: 40,
  },
  grabber: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.grayBorder,
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.grayBorder,
    marginTop: 24,
  },
  input: {
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.folderGray,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  sendButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.brown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.folderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.grayBorder,
  },
});

export default ReturnTimeSheet;
