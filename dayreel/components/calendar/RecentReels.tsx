import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/colors';
import { getRecentReels } from '@/lib/database';
import type { Reel } from '@/types';

function formatReelDate(dateStr: string): string {
  const [, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`;
}

function ReelCard({ reel }: { reel: Reel }) {
  return (
    <Pressable style={styles.card} onPress={() => router.push(`/player/${reel.date}`)}>
      <View style={styles.thumbnail}>
        <Ionicons name="play" size={22} color={Colors.text} />
      </View>
      <Text style={styles.dateLabel}>{formatReelDate(reel.date)}</Text>
    </Pressable>
  );
}

export function RecentReels() {
  const [reels, setReels] = useState<Reel[]>([]);

  useEffect(() => {
    setReels(getRecentReels(10));
  }, []);

  if (reels.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent reels</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} />
        ))}
      </ScrollView>
    </View>
  );
}

const CARD_WIDTH = 120;

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.3,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  card: {
    width: CARD_WIDTH,
  },
  thumbnail: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * (16 / 9),
    borderRadius: 12,
    backgroundColor: Colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {
    marginTop: 6,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
