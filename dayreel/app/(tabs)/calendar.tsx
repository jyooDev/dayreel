import { ScrollView, StyleSheet } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';
import { RecentReels } from '@/components/calendar/RecentReels';

export default function CalendarScreen() {
  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <CalendarGrid />
        <RecentReels />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
});
