import { useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/colors';
import { journalAudioPath, journalAudioRelPath, ensureJournalDir } from '@/lib/audio/storage';

const BAR_COUNT = 28;

interface VoiceRecorderProps {
  date: string;
  isRecording: boolean;
  hasRecording: boolean;
  onRecordingStart: () => void;
  onRecordingStop: (relPath: string) => void;
}

export function VoiceRecorder({
  date,
  isRecording,
  hasRecording,
  onRecordingStart,
  onRecordingStop,
}: VoiceRecorderProps) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const barValues = useRef<Animated.Value[]>(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(2))
  ).current;
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  const startBarAnimations = useCallback(() => {
    animationsRef.current.forEach((a) => a.stop());
    animationsRef.current = barValues.map((val, i) => {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: 4 + Math.random() * 18,
            duration: 200 + (i % 5) * 80,
            useNativeDriver: false,
          }),
          Animated.timing(val, {
            toValue: 2 + Math.random() * 6,
            duration: 200 + (i % 4) * 80,
            useNativeDriver: false,
          }),
        ])
      );
      anim.start();
      return anim;
    });
  }, [barValues]);

  const stopBarAnimations = useCallback(() => {
    animationsRef.current.forEach((a) => a.stop());
    barValues.forEach((val) => {
      Animated.timing(val, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [barValues]);

  useEffect(() => {
    if (isRecording) {
      startBarAnimations();
    } else {
      stopBarAnimations();
    }
  }, [isRecording, startBarAnimations, stopBarAnimations]);

  async function handlePress() {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  }

  async function startRecording() {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recordingRef.current = recording;
    onRecordingStart();
  }

  async function stopRecording() {
    const recording = recordingRef.current;
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

    const tempUri = recording.getURI();
    recordingRef.current = null;

    if (tempUri) {
      await ensureJournalDir();
      const dest = journalAudioPath(date);
      const info = await FileSystem.getInfoAsync(dest);
      if (info.exists) await FileSystem.deleteAsync(dest);
      await FileSystem.moveAsync({ from: tempUri, to: dest });
      onRecordingStop(journalAudioRelPath(date));
    }
  }

  const label = isRecording
    ? 'Tap to stop'
    : hasRecording
    ? 'Tap to re-record'
    : 'Tap to start recording';

  return (
    <View style={styles.container}>
      {/* Waveform */}
      <View style={styles.waveform}>
        {barValues.map((val, i) => (
          <Animated.View
            key={i}
            style={[
              styles.bar,
              { height: val },
              isRecording && styles.barActive,
              hasRecording && !isRecording && styles.barDone,
            ]}
          />
        ))}
      </View>

      {/* Mic button */}
      <Pressable
        style={[styles.micButton, isRecording && styles.micButtonRecording]}
        onPress={handlePress}
      >
        <Ionicons
          name={isRecording ? 'stop' : 'mic'}
          size={28}
          color={isRecording ? Colors.text : Colors.accent}
        />
      </Pressable>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 30,
  },
  bar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: Colors.textDim,
  },
  barActive: {
    backgroundColor: Colors.accent,
  },
  barDone: {
    backgroundColor: Colors.textMuted,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonRecording: {
    borderColor: Colors.danger,
    backgroundColor: Colors.surfaceHover,
  },
  label: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
