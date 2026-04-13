import * as FileSystem from 'expo-file-system/legacy';

const base = FileSystem.documentDirectory!;

export function clipDir(date: string): string {
  return `${base}clips/${date}/`;
}

export function clipPath(date: string, id: string): string {
  return `${clipDir(date)}${id}.mp4`;
}

export function thumbnailPath(id: string): string {
  return `${base}thumbnails/${id}.jpg`;
}

export function relPath(absPath: string): string {
  return absPath.replace(base, '');
}

export async function ensureClipDir(date: string): Promise<void> {
  const dir = clipDir(date);
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function ensureThumbnailDir(): Promise<void> {
  const dir = `${base}thumbnails/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
}

export async function deleteClipFiles(filePath: string, thumbnailPath: string): Promise<void> {
  const absFile = `${base}${filePath}`;
  const absThumb = `${base}${thumbnailPath}`;
  await Promise.allSettled([
    FileSystem.deleteAsync(absFile, { idempotent: true }),
    FileSystem.deleteAsync(absThumb, { idempotent: true }),
  ]);
}
