import { View, Text, Pressable, StyleSheet } from "react-native";

import { Colors } from "@/constants/colors";

export type ReflectMode = "voice" | "type";

interface ModeToggleProps {
  mode: ReflectMode;
  onChange: (mode: ReflectMode) => void;
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.option, mode === "voice" && styles.optionActive]}
        onPress={() => onChange("voice")}
      >
        <Text style={[styles.label, mode === "voice" && styles.labelActive]}>
          Voice
        </Text>
      </Pressable>
      <Pressable
        style={[styles.option, mode === "type" && styles.optionActive]}
        onPress={() => onChange("type")}
      >
        <Text style={[styles.label, mode === "type" && styles.labelActive]}>
          Type
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  optionActive: {
    backgroundColor: Colors.accent,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textMuted,
  },
  labelActive: {
    color: Colors.bg,
  },
});
