import { useState } from 'react';
import { ScrollView, View, Image, Text, Pressable, StyleSheet, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/colors';
import { useClipStore } from '@/stores/useClipStore';
import { deleteClipFiles } from '@/lib/video/storage';
import { ClipPreviewModal } from '@/components/camera/ClipPreviewModal';
import type { Clip } from '@/types';

function formatDuration(seconds: number): string {
  return `${Math.round(seconds)}s`;
}

interface ClipItemProps {
  clip: Clip;
  index: number;
  onPress: (clip: Clip) => void;
}

function ClipItem({ clip, index, onPress }: ClipItemProps) {
  const removeClip = useClipStore((s) => s.removeClip);

  function handleDelete() {
    Alert.alert('Delete clip?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteClipFiles(clip.file_path, clip.thumbnail_path);
          removeClip(clip.id, clip.date);
        },
      },
    ]);
  }

  const thumbUri = clip.thumbnail_path
    ? `${FileSystem.documentDirectory}${clip.thumbnail_path}`
    : null;

  return (
    <View style={styles.item}>
      <Pressable style={styles.thumb} onPress={() => onPress(clip)}>
        {thumbUri ? (
          <Image source={{ uri: thumbUri }} style={styles.thumbImage} />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Ionicons name="videocam-outline" size={20} color={Colors.textDim} />
          </View>
        )}
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={16} color={Colors.text} />
        </View>
        <Text style={styles.indexLabel}>{index + 1}</Text>
      </Pressable>
      <Text style={styles.duration}>{formatDuration(clip.duration_seconds)}</Text>
      <Pressable style={styles.deleteButton} onPress={handleDelete} hitSlop={8}>
        <Ionicons name="close-circle" size={18} color={Colors.danger} />
      </Pressable>
    </View>
  );
}

export function ClipStrip() {
  const clips = useClipStore((s) => s.clips);
  const [previewClip, setPreviewClip] = useState<Clip | null>(null);

  if (clips.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No clips yet — tap record to start</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        horizontal
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
      >
        {clips.map((clip, i) => (
          <ClipItem key={clip.id} clip={clip} index={i} onPress={setPreviewClip} />
        ))}
      </ScrollView>
      <ClipPreviewModal clip={previewClip} onClose={() => setPreviewClip(null)} />
    </>
  );
}

const THUMB_SIZE = 64;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    alignItems: 'flex-start',
  },
  empty: {
    height: 88,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.textDim,
    fontSize: 13,
  },
  item: {
    alignItems: 'center',
    gap: 4,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
  },
  thumbImage: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumbPlaceholder: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    backgroundColor: Colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playOverlay: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  indexLabel: {
    position: 'absolute',
    bottom: 4,
    left: 6,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  duration: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  deleteButton: {
    marginTop: 2,
  },
});
