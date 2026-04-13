import { View, TextInput, StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

interface TextEntryProps {
  value: string;
  onChange: (text: string) => void;
}

export function TextEntry({ value, onChange }: TextEntryProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder="How was your day? Write anything..."
        placeholderTextColor={Colors.textDim}
        multiline
        textAlignVertical="top"
        autoFocus={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
