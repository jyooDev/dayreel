import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { CameraViewfinder } from '@/components/camera/CameraViewfinder';
import { ClipStrip } from '@/components/camera/ClipStrip';
import { useClipStore } from '@/stores/useClipStore';

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function RecordScreen() {
  const loadClips = useClipStore((s) => s.loadClips);

  useEffect(() => {
    loadClips(todayDate());
  }, [loadClips]);

  return (
    <View style={styles.container}>
      <CameraViewfinder />
      <ClipStrip />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
