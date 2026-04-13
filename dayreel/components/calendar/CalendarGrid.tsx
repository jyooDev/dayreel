import { useState, useEffect, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { CalendarDay } from '@/components/calendar/CalendarDay';
import { getDatesWithClipsInMonth } from '@/lib/database';
import { Colors } from '@/constants/colors';

const DAY_HEADERS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

function toDateString(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

// Monday-first: Sun(0)→6, Mon(1)→0, Tue(2)→1, ...
function mondayFirstOffset(date: Date): number {
  return (date.getDay() + 6) % 7;
}

interface GridCell {
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
}

function buildGrid(year: number, month: number): GridCell[][] {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const offset = mondayFirstOffset(firstDay);

  const cells: GridCell[] = [];

  // Pad start with empty slots
  for (let i = 0; i < offset; i++) {
    cells.push({ day: 0, dateStr: '', isCurrentMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: toDateString(year, month, d), isCurrentMonth: true });
  }

  // Pad end to complete last row
  while (cells.length % 7 !== 0) {
    cells.push({ day: 0, dateStr: '', isCurrentMonth: false });
  }

  const weeks: GridCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function CalendarGrid() {
  const today = useMemo(() => todayString(), []);
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const [clipDates, setClipDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const yearMonth = `${viewDate.year}-${String(viewDate.month + 1).padStart(2, '0')}`;
    const dates = getDatesWithClipsInMonth(yearMonth);
    setClipDates(new Set(dates));
  }, [viewDate]);

  const weeks = useMemo(() => buildGrid(viewDate.year, viewDate.month), [viewDate]);

  function prevMonth() {
    setViewDate(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 }
    );
  }

  function nextMonth() {
    setViewDate(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 }
    );
  }

  function handleDayPress(dateStr: string) {
    if (!clipDates.has(dateStr)) return;
    router.push(`/player/${dateStr}`);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={prevMonth} hitSlop={12} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} color={Colors.textMuted} />
        </Pressable>
        <Text style={styles.monthTitle}>
          {MONTH_NAMES[viewDate.month]} {viewDate.year}
        </Text>
        <Pressable onPress={nextMonth} hitSlop={12} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
        </Pressable>
      </View>

      {/* Day headers */}
      <View style={styles.dayHeaders}>
        {DAY_HEADERS.map((d) => (
          <Text key={d} style={styles.dayHeader}>{d}</Text>
        ))}
      </View>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <View key={wi} style={styles.week}>
          {week.map((cell, di) =>
            cell.isCurrentMonth ? (
              <CalendarDay
                key={cell.dateStr}
                day={cell.day}
                isToday={cell.dateStr === today}
                hasClips={clipDates.has(cell.dateStr)}
                isCurrentMonth
                onPress={() => handleDayPress(cell.dateStr)}
              />
            ) : (
              <View key={`empty-${wi}-${di}`} style={styles.emptyCell} />
            )
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  navButton: {
    padding: 4,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textDim,
    letterSpacing: 0.5,
  },
  week: {
    flexDirection: 'row',
  },
  emptyCell: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
  },
});
