import { Pressable, Text, View, StyleSheet } from 'react-native';

import { Colors } from '@/constants/colors';

interface CalendarDayProps {
  day: number;
  isToday: boolean;
  hasClips: boolean;
  isCurrentMonth: boolean;
  onPress: () => void;
}

export function CalendarDay({ day, isToday, hasClips, isCurrentMonth, onPress }: CalendarDayProps) {
  return (
    <Pressable
      style={[
        styles.cell,
        hasClips && !isToday && styles.cellWithClips,
        isToday && styles.cellToday,
        !isCurrentMonth && styles.cellOutside,
      ]}
      onPress={onPress}
      disabled={!isCurrentMonth}
    >
      <Text
        style={[
          styles.dayText,
          isToday && styles.dayTextToday,
          !isCurrentMonth && styles.dayTextOutside,
        ]}
      >
        {day}
      </Text>
      {hasClips && (
        <View style={[styles.dot, isToday && styles.dotToday]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  cellWithClips: {
    backgroundColor: Colors.surface,
  },
  cellToday: {
    backgroundColor: Colors.accent,
  },
  cellOutside: {
    opacity: 0,
  },
  dayText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  dayTextToday: {
    color: Colors.bg,
    fontWeight: '700',
  },
  dayTextOutside: {
    color: Colors.textDim,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.accent,
  },
  dotToday: {
    backgroundColor: Colors.bg,
  },
});
