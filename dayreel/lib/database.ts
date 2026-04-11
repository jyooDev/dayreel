import * as SQLite from 'expo-sqlite';

import type { Clip, Journal, Reel, Settings } from '@/types';

const db = SQLite.openDatabaseSync('dayreel.db');

export function initDatabase(): void {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS clips (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      file_path TEXT NOT NULL,
      thumbnail_path TEXT NOT NULL,
      duration_seconds REAL NOT NULL,
      order_index INTEGER NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reels (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      file_path TEXT NOT NULL,
      duration_seconds REAL NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS journals (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      file_path TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      wake_up_time TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

// ─── Clips ────────────────────────────────────────────────────────────────────

export function insertClip(clip: Clip): void {
  db.runSync(
    `INSERT INTO clips (id, date, file_path, thumbnail_path, duration_seconds, order_index, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [clip.id, clip.date, clip.file_path, clip.thumbnail_path, clip.duration_seconds, clip.order_index, clip.created_at]
  );
}

export function getClipsByDate(date: string): Clip[] {
  return db.getAllSync<Clip>(
    `SELECT * FROM clips WHERE date = ? ORDER BY order_index ASC`,
    [date]
  );
}

export function deleteClip(id: string): void {
  db.runSync(`DELETE FROM clips WHERE id = ?`, [id]);
}

export function reorderClips(date: string, orderedIds: string[]): void {
  orderedIds.forEach((id, index) => {
    db.runSync(`UPDATE clips SET order_index = ? WHERE id = ? AND date = ?`, [index, id, date]);
  });
}

// ─── Reels ────────────────────────────────────────────────────────────────────

export function upsertReel(reel: Reel): void {
  db.runSync(
    `INSERT INTO reels (id, date, file_path, duration_seconds, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       file_path = excluded.file_path,
       duration_seconds = excluded.duration_seconds,
       status = excluded.status`,
    [reel.id, reel.date, reel.file_path, reel.duration_seconds, reel.status, reel.created_at]
  );
}

export function getReelByDate(date: string): Reel | null {
  return db.getFirstSync<Reel>(`SELECT * FROM reels WHERE date = ?`, [date]) ?? null;
}

export function getRecentReels(limit: number): Reel[] {
  return db.getAllSync<Reel>(
    `SELECT * FROM reels WHERE status = 'ready' ORDER BY date DESC LIMIT ?`,
    [limit]
  );
}

export function getDatesWithReadyReels(): string[] {
  const rows = db.getAllSync<{ date: string }>(
    `SELECT date FROM reels WHERE status = 'ready' ORDER BY date DESC`
  );
  return rows.map((r) => r.date);
}

// ─── Journals ─────────────────────────────────────────────────────────────────

export function upsertJournal(journal: Journal): void {
  db.runSync(
    `INSERT INTO journals (id, date, type, content, file_path, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       type = excluded.type,
       content = excluded.content,
       file_path = excluded.file_path`,
    [journal.id, journal.date, journal.type, journal.content, journal.file_path, journal.created_at]
  );
}

export function getJournalByDate(date: string): Journal | null {
  return db.getFirstSync<Journal>(`SELECT * FROM journals WHERE date = ?`, [date]) ?? null;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export function upsertSettings(settings: Settings): void {
  db.runSync(
    `INSERT INTO settings (id, wake_up_time, created_at, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       wake_up_time = excluded.wake_up_time,
       updated_at = excluded.updated_at`,
    [settings.id, settings.wake_up_time, settings.created_at, settings.updated_at]
  );
}

export function getSettings(): Settings | null {
  return db.getFirstSync<Settings>(`SELECT * FROM settings LIMIT 1`) ?? null;
}
