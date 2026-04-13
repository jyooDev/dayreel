import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import { Screen } from '@/components/ui/screen';
import { Button } from '@/components/ui/button';
import { ModeToggle, type ReflectMode } from '@/components/reflect/ModeToggle';
import { VoiceRecorder } from '@/components/reflect/VoiceRecorder';
import { TextEntry } from '@/components/reflect/TextEntry';
import { ReelReadyCard } from '@/components/reflect/ReelReadyCard';
import { useJournalStore } from '@/stores/useJournalStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { upsertReel, getClipsByDate } from '@/lib/database';
import { Colors } from '@/constants/colors';

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[month - 1]} ${day}, ${year}`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default function ReflectScreen() {
  const date = todayDate();

  const [mode, setMode] = useState<ReflectMode>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [audioRelPath, setAudioRelPath] = useState('');
  const [textContent, setTextContent] = useState('');
  const [clipCount, setClipCount] = useState(0);
  const [saved, setSaved] = useState(false);

  const { journal, loadJournal, saveJournal } = useJournalStore();
  const loadSettings = useSettingsStore((s) => s.loadSettings);

  useEffect(() => {
    loadJournal(date);
    loadSettings();
    setClipCount(getClipsByDate(date).length);
  }, [date, loadJournal, loadSettings]);

  useEffect(() => {
    if (journal) {
      if (journal.type === 'voice') {
        setMode('voice');
        setAudioRelPath(journal.file_path);
      } else {
        setMode('type');
        setTextContent(journal.content);
      }
    }
  }, [journal]);

  function handleSave() {
    const hasContent = mode === 'voice' ? !!audioRelPath : !!textContent.trim();
    if (!hasContent) {
      Alert.alert('Nothing to save', mode === 'voice' ? 'Record a voice memo first.' : 'Write something first.');
      return;
    }

    const now = new Date().toISOString();
    const journalId = journal?.id ?? generateId();

    saveJournal({
      id: journalId,
      date,
      type: mode === 'voice' ? 'voice' : 'text',
      content: mode === 'type' ? textContent.trim() : '',
      file_path: mode === 'voice' ? audioRelPath : '',
      created_at: journal?.created_at ?? now,
    });

    upsertReel({
      id: generateId(),
      date,
      file_path: '',
      duration_seconds: 0,
      status: 'pending',
      created_at: now,
    });

    setSaved(true);
    Alert.alert('Saved!', "Your reel will be compiled tonight.");
  }

  return (
    <Screen style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How was your day?</Text>
        <Text style={styles.subtitle}>
          {formatDate(date)} — {clipCount} clip{clipCount !== 1 ? 's' : ''} recorded
        </Text>
      </View>

      <ModeToggle mode={mode} onChange={setMode} />

      {/* Content area */}
      {mode === 'voice' ? (
        <VoiceRecorder
          date={date}
          isRecording={isRecording}
          hasRecording={!!audioRelPath}
          onRecordingStart={() => setIsRecording(true)}
          onRecordingStop={(relPath) => {
            setIsRecording(false);
            setAudioRelPath(relPath);
          }}
        />
      ) : (
        <TextEntry value={textContent} onChange={setTextContent} />
      )}

      {/* Bottom */}
      <View style={styles.bottom}>
        <ReelReadyCard />
        <Button
          label={saved ? 'Saved!' : 'Save & compile tonight'}
          onPress={handleSave}
          disabled={saved}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 20,
  },
  header: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  bottom: {
    gap: 12,
    paddingBottom: 8,
  },
});
