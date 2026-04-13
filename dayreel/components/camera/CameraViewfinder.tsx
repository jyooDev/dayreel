import { useRef, useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as FileSystem from 'expo-file-system/legacy';
import { Ionicons } from '@expo/vector-icons';

import { Colors } from '@/constants/colors';
import { Config } from '@/constants/config';
import { useClipStore } from '@/stores/useClipStore';
import { ensureClipDir, ensureThumbnailDir, clipPath, thumbnailPath, relPath } from '@/lib/video/storage';
import type { Clip } from '@/types';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

interface CameraViewfinderProps {
  onClipAdded?: () => void;
}

export function CameraViewfinder({ onClipAdded }: CameraViewfinderProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const cameraRef = useRef<CameraView>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const addClip = useClipStore((s) => s.addClip);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const stopRecording = useCallback(() => {
    cameraRef.current?.stopRecording();
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const startRecording = useCallback(async () => {
    if (!cameraRef.current || isRecording) return;

    setIsRecording(true);
    setElapsed(0);

    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= Config.maxClipDurationSeconds) {
          stopRecording();
          return Config.maxClipDurationSeconds;
        }
        return e + 1;
      });
    }, 1000);

    const date = todayDate();
    const id = generateId();
    await ensureClipDir(date);

    try {
      const result = await cameraRef.current.recordAsync({
        maxDuration: Config.maxClipDurationSeconds,
      });

      if (result?.uri) {
        await ensureThumbnailDir();
        const dest = clipPath(date, id);
        await FileSystem.moveAsync({ from: result.uri, to: dest });

        let thumbRelPath = '';
        try {
          const thumb = await VideoThumbnails.getThumbnailAsync(dest, { time: 0 });
          const thumbDest = thumbnailPath(id);
          await FileSystem.moveAsync({ from: thumb.uri, to: thumbDest });
          thumbRelPath = relPath(thumbDest);
        } catch {
          // thumbnail generation failed, use empty string
        }

        const clip: Clip = {
          id,
          date,
          file_path: relPath(dest),
          thumbnail_path: thumbRelPath,
          duration_seconds: elapsed || 1,
          order_index: 0,
          created_at: new Date().toISOString(),
        };

        addClip(clip);
        onClipAdded?.();
      }
    } catch {
      // recording cancelled or failed
    } finally {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRecording(false);
      setElapsed(0);
    }
  }, [isRecording, elapsed, addClip, onClipAdded, stopRecording]);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access is required to record clips.</Text>
        <Pressable style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const remaining = Config.maxClipDurationSeconds - elapsed;

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
        mode="video"
        videoQuality="1080p"
      />

      {isRecording && (
        <View style={styles.timerContainer}>
          <View style={styles.recDot} />
          <Text style={styles.timerText}>{remaining}s</Text>
        </View>
      )}

      <View style={styles.controls}>
        <Pressable
          style={[styles.recordButton, isRecording && styles.recordButtonActive]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          {isRecording ? (
            <View style={styles.stopIcon} />
          ) : (
            <Ionicons name="videocam" size={28} color={Colors.bg} />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  permissionText: {
    color: Colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: Colors.bg,
    fontWeight: '600',
    fontSize: 15,
  },
  timerContainer: {
    position: 'absolute',
    top: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  timerText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
  },
  recordButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
  },
  recordButtonActive: {
    backgroundColor: Colors.danger,
    shadowColor: Colors.danger,
  },
  stopIcon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.text,
  },
});
