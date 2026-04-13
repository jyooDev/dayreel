import { create } from 'zustand';

import { getJournalByDate, upsertJournal } from '@/lib/database';
import type { Journal } from '@/types';

interface JournalStore {
  journal: Journal | null;
  loadJournal: (date: string) => void;
  saveJournal: (journal: Journal) => void;
}

export const useJournalStore = create<JournalStore>((set) => ({
  journal: null,

  loadJournal: (date) => {
    const journal = getJournalByDate(date);
    set({ journal });
  },

  saveJournal: (journal) => {
    upsertJournal(journal);
    set({ journal });
  },
}));
