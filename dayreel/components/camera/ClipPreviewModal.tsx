import { useEffect } from "react";
import { Modal, View, Pressable, Text, StyleSheet } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";

import { Colors } from "@/constants/colors";
import type { Clip } from "@/types";

interface ClipPreviewModalProps {
  clip: Clip | null;
  onClose: () => void;
}

function VideoPlayer({ clip, onClose }: { clip: Clip; onClose: () => void }) {
  const uri = `${FileSystem.documentDirectory}${clip.file_path}`;
  const player = useVideoPlayer(uri);

  useEffect(() => {
    player.loop = true;
    player.play();
  }, [player]);

  return (
    <View style={styles.container}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls={false}
      />
      <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
        <Ionicons name="close" size={24} color={Colors.text} />
      </Pressable>
      <Text style={styles.label}>
        Clip {clip.order_index + 1} · {Math.round(clip.duration_seconds)}s
      </Text>
    </View>
  );
}

export function ClipPreviewModal({ clip, onClose }: ClipPreviewModalProps) {
  return (
    <Modal
      visible={!!clip}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {clip && <VideoPlayer clip={clip} onClose={onClose} />}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: "85%",
    aspectRatio: 9 / 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.surface,
  },
  video: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  label: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    color: Colors.text,
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
});
