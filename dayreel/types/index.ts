export type ReelStatus = 'pending' | 'compiling' | 'ready' | 'failed';
export type JournalType = 'voice' | 'text';

export interface Clip {
  id: string;
  date: string; // YYYY-MM-DD
  file_path: string; // relative to documentDirectory
  thumbnail_path: string; // relative to documentDirectory
  duration_seconds: number;
  order_index: number;
  created_at: string; // ISO timestamp
}

export interface Reel {
  id: string;
  date: string;
  file_path: string;
  duration_seconds: number;
  status: ReelStatus;
  created_at: string;
}

export interface Journal {
  id: string;
  date: string;
  type: JournalType;
  content: string; // text content, or empty string for voice entries
  file_path: string; // empty string for text entries
  created_at: string;
}

export interface Settings {
  id: string;
  wake_up_time: string; // HH:MM
  created_at: string;
  updated_at: string;
}
