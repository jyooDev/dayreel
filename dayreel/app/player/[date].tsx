import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { Screen } from '@/components/ui/screen';
import { Colors } from '@/constants/colors';

export default function PlayerScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();

  return (
    <Screen style={styles.screen}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <View style={styles.center}>
        <Text style={styles.text}>Player — {date}</Text>
        <Text style={styles.sub}>Coming soon</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 16,
  },
  back: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: Colors.accent,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
  },
  sub: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
