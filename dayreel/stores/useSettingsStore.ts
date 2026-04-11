import { create } from 'zustand';

import { getSettings, upsertSettings } from '@/lib/database';
import { Config } from '@/constants/config';
import type { Settings } from '@/types';

interface SettingsState {
  settings: Settings | null;
  setSettings: (settings: Settings) => void;
  loadSettings: () => void;
  saveWakeUpTime: (wakeUpTime: string) => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,

  setSettings: (settings) => set({ settings }),

  loadSettings: () => {
    const settings = getSettings();
    set({ settings });
  },

  saveWakeUpTime: (wakeUpTime) => {
    const now = new Date().toISOString();
    const existing = get().settings;
    const updated: Settings = {
      id: existing?.id ?? 'settings',
      wake_up_time: wakeUpTime,
      created_at: existing?.created_at ?? now,
      updated_at: now,
    };
    upsertSettings(updated);
    set({ settings: updated });
  },
}));

export function getDefaultWakeUpTime(): string {
  return Config.defaultWakeUpTime;
}
