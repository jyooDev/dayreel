import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { useSettingsStore } from '@/stores/useSettingsStore';

export default function OnboardingScreen() {
  const saveWakeUpTime = useSettingsStore((s) => s.saveWakeUpTime);

  const [wakeTime, setWakeTime] = useState<Date>(() => {
    const [h, m] = Config.defaultWakeUpTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  });

  function handleContinue() {
    const h = String(wakeTime.getHours()).padStart(2, '0');
    const m = String(wakeTime.getMinutes()).padStart(2, '0');
    saveWakeUpTime(`${h}:${m}`);
    router.replace('/(tabs)/record');
  }

  const formattedTime = wakeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.top}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>☀️</Text>
          </View>
          <Text style={styles.title}>When do you wake up?</Text>
          <Text style={styles.subtitle}>
            We&apos;ll have your DayReel ready by the time you open your eyes.
          </Text>
        </View>

        <View style={styles.pickerWrap}>
          <Text style={styles.timeDisplay}>{formattedTime}</Text>
          <DateTimePicker
            value={wakeTime}
            mode="time"
            display="spinner"
            onChange={(_, date) => date && setWakeTime(date)}
            textColor={Colors.text}
            style={styles.picker}
          />
        </View>

        <View style={styles.bottom}>
          <Button label="Get Started" onPress={handleContinue} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  top: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 21,
  },
  pickerWrap: {
    alignItems: 'center',
    gap: 8,
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.accent,
    letterSpacing: -1,
  },
  picker: {
    width: '100%',
    height: 180,
  },
  bottom: {
    gap: 12,
  },
});
