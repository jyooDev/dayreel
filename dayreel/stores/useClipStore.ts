import { create } from 'zustand';

import { getClipsByDate, insertClip, deleteClip, reorderClips } from '@/lib/database';
import type { Clip } from '@/types';

interface ClipStore {
  clips: Clip[];
  loadClips: (date: string) => void;
  addClip: (clip: Clip) => void;
  removeClip: (id: string, date: string) => void;
  reorder: (date: string, orderedIds: string[]) => void;
}

export const useClipStore = create<ClipStore>((set) => ({
  clips: [],

  loadClips: (date) => {
    const clips = getClipsByDate(date);
    set({ clips });
  },

  addClip: (clip) => {
    insertClip(clip);
    set((state) => ({ clips: [...state.clips, clip] }));
  },

  removeClip: (id, date) => {
    deleteClip(id);
    set((state) => ({ clips: state.clips.filter((c) => c.id !== id) }));
    reorderClips(date, []);
  },

  reorder: (date, orderedIds) => {
    reorderClips(date, orderedIds);
    set((state) => {
      const map = new Map(state.clips.map((c) => [c.id, c]));
      return { clips: orderedIds.map((id, i) => ({ ...map.get(id)!, order_index: i })) };
    });
  },
}));
