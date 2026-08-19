import React, { useRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../constants/Colors';

export interface CodeInputProps {
  value: string;
  onChangeText: (text: string) => void;
  length?: number;
}

const DEFAULT_LENGTH = 6;
const BOX_WIDTH = 51;
const BOX_HEIGHT = 98;
const BOX_GAP = 8;

const CodeInput = ({ value, onChangeText, length = DEFAULT_LENGTH }: CodeInputProps) => {
  const inputRef = useRef<TextInput>(null);
  const chars = value.toUpperCase().split('');

  return (
    <Pressable style={styles.row} onPress={() => inputRef.current?.focus()}>
      {Array.from({ length }).map((_, index) => (
        <View key={index} style={styles.box}>
          <Text style={styles.char}>{chars[index] ?? ''}</Text>
        </View>
      ))}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={value}
        onChangeText={(text) => onChangeText(text.toUpperCase().slice(0, length))}
        maxLength={length}
        autoFocus
        autoCapitalize="characters"
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: BOX_GAP,
  },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    borderRadius: 8,
    backgroundColor: colors.folderGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  char: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.black,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});

export default CodeInput;
