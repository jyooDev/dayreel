import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function ReelReadyCard() {
  const settings = useSettingsStore((s) => s.settings);
  const wakeUpTime = settings?.wake_up_time ?? Config.defaultWakeUpTime;

  return (
    <View style={styles.card}>
      <Ionicons name="time-outline" size={18} color={Colors.textMuted} />
      <View style={styles.text}>
        <Text style={styles.title}>Morning reel ready by</Text>
        <Text style={styles.subtitle}>Your daily film, compiled overnight</Text>
      </View>
      <View style={styles.timeBadge}>
        <Text style={styles.timeText}>{wakeUpTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  timeBadge: {
    backgroundColor: Colors.surfaceHover,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
});
