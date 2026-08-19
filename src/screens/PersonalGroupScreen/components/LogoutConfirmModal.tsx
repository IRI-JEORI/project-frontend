import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../../../theme/tokens';

const cautionImage = require('../../../assets/images/caution.png');

export interface LogoutConfirmModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal = ({
  visible,
  onCancel,
  onConfirm,
}: LogoutConfirmModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Image
            source={cautionImage}
            style={styles.cautionImage}
            resizeMode="contain"
          />
          <Text style={styles.title}>로그아웃 할까요?</Text>
          <Text style={styles.subtitle}>정보는 남아있어요</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelLabel}>아니요</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmLabel}>네</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  card: {
    width: 315,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  cautionImage: {
    width: 104,
    height: 104,
  },
  title: {
    marginTop: 20,
    fontSize: 24,
    fontFamily: 'PretendardBold',
    color: colors.black,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'PretendardMedium',
    color: colors.grayBorder,
  },
  buttonRow: {
    marginTop: 28,
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(234,234,234,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelLabel: {
    fontSize: 16,
    fontFamily: 'PretendardSemiBold',
    color: colors.grayText,
  },
  confirmButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmLabel: {
    fontSize: 16,
    fontFamily: 'PretendardSemiBold',
    color: colors.white,
  },
});

export default LogoutConfirmModal;
