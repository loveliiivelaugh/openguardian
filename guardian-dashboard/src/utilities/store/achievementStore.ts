import { create } from 'zustand';

interface AchievementStore {
  unlocked: {
    title: string;
    description?: string;
  } | null;
  triggerUnlock: (title: string, description?: string) => void;
  clearUnlock: () => void;
}

export const useAchievementStore = create<AchievementStore>((set) => ({
  unlocked: null,
  triggerUnlock: (title, description) => set({ unlocked: { title, description } }),
  clearUnlock: () => set({ unlocked: null }),
}));


interface XPStore {
  xp: number;
  level: number;
  addXP: (amount: number) => void;
}
export const useXPStore = create<XPStore>((set) => ({
  xp: 0,
  level: 1,
  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount;
    const newLevel = Math.floor(newXP / 100) + 1; // 100 XP per level
    return { xp: newXP, level: newLevel };
  }),
}));
