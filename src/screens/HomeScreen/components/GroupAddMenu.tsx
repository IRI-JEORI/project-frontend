import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { colors } from '../../../theme/tokens';

export interface GroupAddMenuProps {
  visible: boolean;
  onClose: () => void;
  onPressCreateRoom?: () => void;
  onPressEnterCode?: () => void;
}

const GroupAddMenu = ({
  visible,
  onClose,
  onPressCreateRoom,
  onPressEnterCode,
}: GroupAddMenuProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onClose();
                onPressCreateRoom?.();
              }}
            >
              <Text style={styles.itemLabel}>방 생성하기</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                onClose();
                onPressEnterCode?.();
              }}
            >
              <Text style={styles.itemLabel}>초대 코드 입력하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  menu: {
    position: 'absolute',
    left: 124,
    top: 319,
    width: 170,
    backgroundColor: colors.white,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemLabel: {
    fontSize: 14,
    fontFamily: 'PretendardMedium',
    color: colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.folderGray,
  },
});

export default GroupAddMenu;
