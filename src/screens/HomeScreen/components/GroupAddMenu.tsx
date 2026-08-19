import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { colors } from '../../../theme/tokens';

export interface GroupAddMenuProps {
  visible: boolean;
  anchor: { x: number; y: number; width: number; height: number } | null;
  onClose: () => void;
  onPressCreateRoom?: () => void;
  onPressEnterCode?: () => void;
}

const MENU_WIDTH = 170;
const MENU_GAP = 8;
const SCREEN_EDGE_GAP = 8;

const GroupAddMenu = ({
  visible,
  anchor,
  onClose,
  onPressCreateRoom,
  onPressEnterCode,
}: GroupAddMenuProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const right = anchor ? anchor.x + anchor.width + MENU_GAP : SCREEN_EDGE_GAP;
  const left = anchor
    ? right + MENU_WIDTH <= windowWidth - SCREEN_EDGE_GAP
      ? right
      : Math.max(SCREEN_EDGE_GAP, anchor.x - MENU_WIDTH - MENU_GAP)
    : SCREEN_EDGE_GAP;
  const top = anchor?.y ?? SCREEN_EDGE_GAP;

  return (
    <Modal
      visible={visible && anchor !== null}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <View style={[styles.menu, { left, top }]}>
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
    width: MENU_WIDTH,
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
