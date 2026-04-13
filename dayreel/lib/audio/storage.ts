import * as FileSystem from 'expo-file-system/legacy';

const base = FileSystem.documentDirectory!;

export function journalAudioPath(date: string): string {
  return `${base}journals/${date}.m4a`;
}

export function journalAudioRelPath(date: string): string {
  return `journals/${date}.m4a`;
}

export async function ensureJournalDir(): Promise<void> {
  const dir = `${base}journals/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function deleteJournalAudio(date: string): Promise<void> {
  const path = journalAudioPath(date);
  await FileSystem.deleteAsync(path, { idempotent: true });
}
